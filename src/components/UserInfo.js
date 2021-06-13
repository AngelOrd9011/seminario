import { graphql } from '@gqless/react';
import React, { useState, useEffect, useRef } from "react";
import { useKeycloak } from '@react-keycloak/web';
import { Card } from 'primereact/card';
import { gql, useQuery, Query, useApolloClient, useMutation, Mutation, useLazyQuery } from '@apollo/client';

export const UserInfo = graphql((roles) => {
  const [loading, setLoading] = useState(true);
  const client = useApolloClient();
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
  return (
    <Card title='Datos del usuario' className='card no-gutter widget-overview-box widget-overview-box-1'>
      <div className='p-fluid p-formgrid p-grid'>
        <h5>Nombre: {user.name}</h5>
      </div>
      <div className='p-fluid p-formgrid p-grid'>
        <h5>Matricula: {user.matricula}</h5>
      </div>
      <div className='p-fluid p-formgrid p-grid'>
        <h5>Email: {user.email}</h5>
      </div>
      {/* <AppCodeHighlight>{JSON.stringify(datosEmpleado, null, 2)}</AppCodeHighlight> */}
    </Card>
  );
});
