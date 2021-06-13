import classNames from 'classnames';
import AppBreadcrumb from './AppBreadcrumb';
import { useKeycloak } from '@react-keycloak/web';
import React, { useState, useEffect, useRef } from "react";
import { Button } from 'primereact/button';
import { graphql } from '@gqless/react';
import { useHistory } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';

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
  const name = keycloak.tokenParsed.name;
  const [user, setUser] = useState(
    {
      name: name,
    }
); 
  const history = useHistory();
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

        <img id='logo-mobile' className='mobile-logo' src='./assets/images/icono-tesi.png' alt='diamond-layout' />
      </div>

      <div className='topbar-right'>
        <ul className='topbar-menu'>
          <li>
            <span><b>{user.name}</b></span>
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
