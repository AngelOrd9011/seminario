import { Logger } from '@gqless/logger';
import { graphql } from '@gqless/react';
import { useKeycloak } from '@react-keycloak/web';
import { resolved } from 'gqless';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { useEffect, useState } from 'react';
import AppCodeHighlight from '../AppCodeHighlight';
import { gql, useQuery, Query, useApolloClient, useMutation, Mutation, useLazyQuery } from '@apollo/client';

export const UserInfo = graphql(() => {
  const [loading, setLoading] = useState(true);
  const client = useApolloClient();
  const { keycloak, initialized } = useKeycloak();  
  return (
    <Card title='Datos del usuario' className='card no-gutter widget-overview-box widget-overview-box-1'>
      <div className='p-fluid p-formgrid p-grid'>
      
      </div>
      {/* <AppCodeHighlight>{JSON.stringify(datosEmpleado, null, 2)}</AppCodeHighlight> */}
    </Card>
  );
});
