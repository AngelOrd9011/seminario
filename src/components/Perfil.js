import { UserInfo } from './UserInfo';
import { useKeycloak } from '@react-keycloak/web';

// import { query, client } from '../graphql-hasura-generated';
// import { query as query2, client as client2 } from '../graphql-hasura-generated';
import { graphql } from '@gqless/react';
import { resolved } from 'gqless';
import { Logger } from '@gqless/logger';
import { Suspense } from 'react';

import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';

import useSWR from 'swr';

import { gql, useQuery, Query, useApolloClient, useMutation, Mutation, useLazyQuery } from '@apollo/client';

const Create_perfil_mutation = gql`
  mutation MyInsertPerfilMutation($picture_type: String = null, $picture: bytea = null, $username: String!) {
    insert_mind_rh_usuario_one(
      object: { username: $username, picture: $picture, picture_type: $picture_type }
      on_conflict: { constraint: rh_usuario_username_key, update_columns: [picture, picture_type] }
    ) {
      id
    }
  }
`;

const MY_QUERY_QUERY = gql`
  query MyQuery($username: String!) {
    mind_rh_usuario(where: { username: { _eq: $username } }) {
      picture_type
      picturebase64
      username
      id
    }
  }
`;

export const Perfil = () => {
  const fu = useRef(null);
  const toast = useRef(null);
  const { keycloak, initialized } = useKeycloak();
  const UserHeader = {
    context: {
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
        'X-Hasura-Role': 'user',
      },
    },
  };
  const [insertPerfil, { insertmutationData }] = useMutation(Create_perfil_mutation, UserHeader);
  const curp = keycloak.tokenParsed.preferred_username.toUpperCase();
  const { loading, error, data } = useQuery(MY_QUERY_QUERY, {
    variables: { username: curp },
    ...UserHeader,
  });

  const [fotoPerfil, setFotoPerfil] = useState(null);
  useEffect(() => {
    if (loading === false && data) {
      setFotoPerfil(
        data?.mind_rh_usuario?.[0].picture_type && data?.mind_rh_usuario?.[0].picturebase64
          ? data?.mind_rh_usuario?.[0].picture_type + ',' + data?.mind_rh_usuario?.[0].picturebase64
          : null
      );
    }
  }, [loading, data]);
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
    //console.log(event.files);
    readFileDataAsHEX(event.files[0]).then((data) => {
      insertPerfil({
        variables: { username: curp, picture: '\\x' + data.picture, picture_type: data.picture_type },
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
      variables: { username: curp, picture: null, picture_type: null },
    }).then((data) => {
      setFotoPerfil(null);
      toast.current.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Se ha actualizado su perfil(Se elimino la imagen de perfil)',
        life: 3000,
      });
    });
  };
  return (
    <>
      <Suspense fallback={<span>loading...</span>}>
        <UserInfo />
      </Suspense>
      <div className='p-grid'>
        <div className='p-col-12'>
          <div className='card docs'>
            <h2>Perfil de usuario</h2>
            {/* <MyQueryQuery></MyQueryQuery> */}
            <Toast ref={toast} />
            <div className='p-d-flex p-flex-column'>
              <div className='p-mb-2'>
                <FileUpload
                  ref={fu}
                  mode='basic'
                  accept='image/*'
                  maxFileSize={1000000}
                  label='Seleccione una imagen de perfil'
                  chooseLabel='Seleccione una imagen de perfil'
                  className='p-mr-2 p-d-inline-block'
                  onSelect={myUploader}
                />
              </div>
              <div className='p-mb-2'>
                <img id='algo' width='auto' height='auto' src={fotoPerfil} />
              </div>
              <div>{fotoPerfil && <Button icon='pi pi-trash' className='p-button-warning' onClick={eliminarimagen} label='Eliminar imagen' />}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
