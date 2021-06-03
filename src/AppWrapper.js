import React, { useEffect, useState } from 'react';
import { Route, useLocation, withRouter, Redirect } from 'react-router-dom';
import App from './App';
import { Login } from './pages/Login';
import { Error } from './pages/Error';
import { NotFound } from './pages/NotFound';
import { Access } from './pages/Access';
import { Home } from './Home';
import { useKeycloak } from '@react-keycloak/web';
import { Suspense } from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

const defaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
};

const AppWrapper = () => {
  let location = useLocation();
  const { keycloak, initialized } = useKeycloak();
  const [refreshedToken, setRefreshedToken] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  const refreshToken = (minValidity) => {
    return new Promise((resolve, reject) => {
      keycloak
        .updateToken(minValidity)
        .success(function () {
          resolve();
        })
        .error(function () {
          reject();
        });
    });
  };

  useEffect(() => {
    if (token && !refreshedToken) {
      const fetchData = async () => {
        await refreshToken(5000);
      };
      fetchData().then(() => {
        setRefreshedToken(true);
      });
    }
  }, [token]);

  const checkAuthenticated = (pathname) => {
    //usamos redirect porque cuando keycloak nos redirecciona le agrega el estado de la sesion a la url de redireccion lo que causa conflicto con las rutas
    if (keycloak.authenticated && pathname.includes('&state')) return <Redirect to='/' />;
    else if (keycloak.authenticated) {
      const apolloClient = new ApolloClient({
        uri: 'http://127.0.0.1:4000/v1/graphql',
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
        cache: new InMemoryCache({
          addTypename: false,
        }),
        defaultOptions: defaultOptions,
      });
      if (!token && !refreshedToken) setToken(keycloak.token);
      //console.log(keycloak.token);
      return (
        <ApolloProvider client={apolloClient}>
          <Suspense fallback={<span>Cargando...</span>}>
            <App roles={keycloak.resourceAccess.cooLenguas?.roles}></App>
          </Suspense>
        </ApolloProvider>
      );
    } else return <Home />;
  };

  if (!initialized) return <h3>Cargando...</h3>;

  switch (location.pathname) {
    case '/login':
      return <Route path='/login' component={Login} />;
    case '/error':
      return <Route path='/error' component={Error} />;
    case '/notfound':
      return <Route path='/notfound' component={NotFound} />;
    case '/access':
      return <Route path='/access' component={Access} />;
    case '/home':
      return <Route path='/home' component={Home} />;
    default:
      return checkAuthenticated(location.pathname);
  }
};

export default withRouter(AppWrapper);
