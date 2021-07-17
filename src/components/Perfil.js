import { UserInfo } from './UserInfo';
import { useKeycloak } from '@react-keycloak/web';

import { graphql } from '@gqless/react';
import { Suspense } from 'react';

import React, { useState, useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import 'primeflex/primeflex.css';

import useSWR from 'swr';

import { gql, useQuery, Query, useApolloClient, useMutation, Mutation, useLazyQuery } from '@apollo/client';

const Create_perfil_mutation = gql`
  mutation MyInsertPerfilMutation($picture_type: String = null, $picture: bytea = null, $username: String!) {
    insert_user_profile_one(
      object: { username: $username, picturebase64: $picture, picture_type: $picture_type }
      on_conflict: { constraint: user_profile_username_key, update_columns: [picturebase64, picture_type] }
    ) {
      id
    }
  }
`;

const MY_QUERY_QUERY = gql`
  query MyQuery($username: String!) {
    user_profile(where: { username: { _eq: $username } }) {
      picture_type
      picturebase64
      username
      id
    }
  }
`;

export const Perfil = graphql(() => {
  const { keycloak, initialized } = useKeycloak();
  const userName = keycloak.tokenParsed.preferred_username.toUpperCase();
  const name = keycloak.tokenParsed.name;
  const email = keycloak.tokenParsed.email;
  const userID = keycloak.tokenParsed.sub;
  const [user, setUser] = useState(
      {
        matricula: userName,
        name: name,
        email: email,
        id: userID,
      }
  ); 
  const fu = useRef(null);
  const toast = useRef(null);
  const UserHeader = {
    context: {
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
        'X-Hasura-Role': 'user',
      },
    },
  };
  const [insertPerfil, { insertmutationData }] = useMutation(Create_perfil_mutation, UserHeader);
  const matricula = keycloak.tokenParsed.preferred_username;
  const { loading, error, data } = useQuery(MY_QUERY_QUERY, {
    variables: { username: matricula },
    ...UserHeader,
  });

  const [fotoPerfil, setFotoPerfil] = useState(null);
  useEffect(() => {
    if (loading === false && data) {
      setFotoPerfil(
        data?.user_profile?.[0].picture_type && data?.user_profile?.[0].picturebase64
          ? data?.user_profile?.[0].picture_type + ',' + data?.user_profile?.[0].picturebase64
          : null
      );
    }
  }, [loading, data]);
  console.log(fotoPerfil)
  const base64ToHex = (str) => {
    //const btoa = window.btoa(str);
    const raw = atob(str);
    let result = '';
    for (let i = 0; i < raw.length; i++) {
      const hex = raw.charCodeAt(i).toString(16);
      result += hex.length === 2 ? hex : '0' + hex;
    }
    return result.toUpperCase();
  };

  const myUploader = (event) => {
    console.log(event.files);
    readFileDataAsHEX(event.files[0]).then((data) => {
      insertPerfil({
        variables: { username: matricula, picture: '\\x' + data.picture, picture_type: data.picture_type },
      }).then((data) => {
        toast.current.show({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Se ha actualizado su perfil',
          life: 3000,
        });
      });
    });
    fu.current.clear();
  };
  const readFileDataAsHEX = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFotoPerfil(event.target.result);
        var res = event.target.result.split(',');
        resolve({ picture_type: res[0], picture: base64ToHex(res[1]) });
      };
      reader.onerror = (err) => {
        reject(err);
      };
      reader.readAsDataURL(file);
    });
  };
  const eliminarimagen = () => {
    insertPerfil({
      variables: { username: matricula, picture: null, picture_type: null },
    }).then((data) => {
      setFotoPerfil(null);
      toast.current.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Se elimino la imagen de perfil',
        life: 3000,
      });
    });
  };
  return (
    <>
      <div className='p-grid'>
        <div className='p-col-12 p-md-8'>
          <div className='card no-gutter widget-overview-box widget-overview-box-1'>
            <h1>Perfil de usuario</h1>
            {/* <MyQueryQuery></MyQueryQuery> */}
            <Toast ref={toast} />
            <div className='p-grid'>
              <div className='p-d-flex p-flex-column p-col-12 p-md-7' style={{padding:'30px 40px'}}>
                <div className='p-fluid p-formgrid'>
                  <h5>Nombre: {user.name}</h5>
                </div>
                <div className='p-fluid p-formgrid'>
                  <h5>Matricula: {user.matricula}</h5>
                </div>
                <div className='p-fluid p-formgrid'>
                  <h5>Email: {user.email}</h5>
                </div>
              </div>
              <div className='p-d-flex p-flex-column p-col-12 p-md-5'>
                <div className='p-mb-2'>
                  <FileUpload
                    ref={fu}
                    mode='basic'
                    accept='image/*'
                    maxFileSize={1000000}
                    label='Agregar imagen de perfil'
                    chooseLabel='Imagen de perfil'
                    className='p-mr-2 p-d-inline-block'
                    onSelect={myUploader}
                  />
                </div>
                <div className='p-mb-2'>
                  <img id='algo' width='250px' height='auto' src={fotoPerfil} style={{borderRadius:'15px'}} />
                </div>
                <div>{fotoPerfil && <Button icon='pi pi-trash' className='p-button-danger' onClick={eliminarimagen} label='Eliminar imagen' />}</div>
              </div>
            </div>
          </div>
        </div>
        <div className='p-col-12 p-md-4'>
        <Suspense fallback={<span>Cargando...</span>}>
          <UserInfo />
        </Suspense>
        </div>
      </div>
    </>
  );
});
