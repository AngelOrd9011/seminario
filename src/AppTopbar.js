import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import AppBreadcrumb from './AppBreadcrumb';
import { useKeycloak } from '@react-keycloak/web';

import { Button } from 'primereact/button';
import { graphql } from '@gqless/react';
import { Logger } from '@gqless/logger';
import { useHistory } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';

const MY_QUERY_QUERY = gql`
  query MyQuery($username: String!) {
    user_entity(where: { username: { _eq: $username } }) {
      first_name
      last_name
      username
      id
    }
  }
`;
const AppTopbar = graphql((props) => {
  const { keycloak, initialized } = useKeycloak();
  const UserHeader = {
    context: {
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
        'X-Hasura-Role': 'user',
      },
    },
  };
  const matricula = keycloak.tokenParsed.preferred_username.toUpperCase();
  const { loading, error, data } = useQuery(MY_QUERY_QUERY, {
    variables: { username: matricula },
    ...UserHeader,
  });

  const history = useHistory();
  const notificationsItemClassName = classNames('notifications-item', {
    'active-menuitem': props.topbarNotificationMenuActive,
  });
  const profileItemClassName = classNames('profile-item', {
    'active-menuitem fadeInDown': props.topbarUserMenuActive,
  });
  
  return (
    <div className='layout-topbar'>
      <div className='topbar-left'>
        <button type='button' className='menu-button p-link' onClick={props.onMenuButtonClick} >
          <i className='pi pi-chevron-left'></i>
        </button>
        <span className='topbar-separator'></span>

        <div className='layout-breadcrumb viewname' style={{ textTransform: 'uppercase' }}>
          <AppBreadcrumb routers={props.routers} />
        </div>

        <img id='logo-mobile' className='mobile-logo' src='assets/layout/images/logo-dark.svg' alt='diamond-layout' />
      </div>

      <div className='topbar-right'>
        <ul className='topbar-menu'>
          <li className='search-item'>
            <button type='button' className='p-link' onClick={props.onSearchClick}>
              <i className='pi pi-search'></i>
            </button>
          </li>
          <li className={notificationsItemClassName}>
            
   
          </li>

          <li className={profileItemClassName}>
          <Button icon="pi pi-user" className="p-button-rounded p-button-success" onClick={props.onTopbarUserMenu} />
            <ul className='profile-menu fade-in-up'>
              <li>
                <button type='button' className='p-link' onClick={() => history.push('/perfil')}>
                  <i className='pi pi-user'></i>
                  <span>Perfil</span>
                </button>
              </li>
              <li>
                <button type='button' className='p-link'>
                  <i className='pi pi-cog'></i>
                  <span>Ajustes</span>
                </button>
              </li>
              <li>
                <button type='button' className='p-link' onClick={() => keycloak.logout()}>
                  <i className='pi pi-power-off'></i>
                  <span>Salir</span>
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
});

export default AppTopbar;
