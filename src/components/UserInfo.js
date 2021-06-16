import { graphql } from '@gqless/react';
import React, { useState, useEffect, useRef } from "react";
import { useKeycloak } from '@react-keycloak/web';
import { Card } from 'primereact/card';
import { gql, useQuery, Query, useApolloClient, useMutation, Mutation, useLazyQuery } from '@apollo/client';

export const UserInfo = graphql(() => {
  const [loading, setLoading] = useState(true);
  const client = useApolloClient();
  const { keycloak, initialized } = useKeycloak(); 
  const userName = keycloak.tokenParsed.preferred_username.toUpperCase();
  const name = keycloak.tokenParsed.name;
  const email = keycloak.tokenParsed.email;
  const userID = keycloak.tokenParsed.sub;
  const roles = keycloak.resourceAccess.cooLenguas?.roles;
  console.log(roles) 
  const [user, setUser] = useState(
      {
        matricula: userName,
        name: name,
        email: email,
        id: userID,
      }
  ); 
  const AditionaTinfo = () => {
    const [info, setInfo] = useState(
      {
        title: '',
      }
    ); 
    let rolesint = [];
    rolesint = [...new Set([...rolesint, ...roles])];
    rolesint.forEach((element, index) => {
      if (element === 'Student') {
        info.title = 'Alumno';
      };
      if (element === 'Teacher') {
        info.title = 'Profesor'
      }
      if (element === 'Administrator') {
        info.title = 'Administrador';
      }
    });
    return(
      <React.Fragment>
        <Card title={info.title} className='card no-gutter widget-overview-box widget-overview-box-1'>

        </Card>
      </React.Fragment>
    );
  };
  return (
    <AditionaTinfo />
  );
});
