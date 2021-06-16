import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { Route } from 'react-router-dom';
import AppTopBar from './AppTopbar';
import AppFooter from './AppFooter';
import AppMenu from './AppMenu';
import AppSearch from './AppSearch';
import PrimeReact from 'primereact/api';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './App.scss';
import { Suspense } from 'react';

import { Dashboard } from './components/Dashboard';
import { Home } from './Home';
import { Perfil } from './components/Perfil';
import { Niveles } from "./components/admin/catalogos/Niveles";
import { Turnos } from "./components/admin/catalogos/Turnos";
import { Modalidades } from "./components/admin/catalogos/Modalidades";
import { Alumnos } from './components/admin/Alumnos';
import { Profesores } from './components/admin/Profesores';

const App = ({ roles }) => {
  const [menuActive, setMenuActive] = useState(false);
  const [menuMode, setMenuMode] = useState('static');
  const [colorScheme, setColorScheme] = useState('light');
  const [menuTheme, setMenuTheme] = useState('layout-sidebar-darkgray');
  const [overlayMenuActive, setOverlayMenuActive] = useState(false);
  const [staticMenuDesktopInactive, setStaticMenuDesktopInactive] = useState(false);
  const [staticMenuMobileActive, setStaticMenuMobileActive] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [topbarUserMenuActive, setTopbarUserMenuActive] = useState(false);
  const [topbarNotificationMenuActive, setTopbarNotificationMenuActive] = useState(false);
  const [rightMenuActive, setRightMenuActive] = useState(false);
  const [configActive, setConfigActive] = useState(false);
  const [inputStyle, setInputStyle] = useState('outlined');
  const [ripple, setRipple] = useState(false);

  let menuClick = false;
  let searchClick = false;
  let userMenuClick = false;
  let notificationMenuClick = false;
  let rightMenuClick = false;
  let configClick = false;

  const menuTop = [
    {
      label: 'Menu',
      icon: 'pi pi-fw pi-home',
      items: [
        { label: 'Inicio', icon: 'pi pi-fw pi-home', to: '/' },
        { label: 'Perfil de Usuario', icon: 'pi pi-fw pi-user', to: '/perfil'},
      ],
    },
    { separator: true },
  ];


  const menuAdmin = [
    {
      label: 'Menu Administrador',
      icon: 'pi pi-fw pi-align-left',
      items: [
        { label: 'Alumnos', icon: 'pi pi-fw pi-users', to: '/Alumnos' },
        { label: 'Expedientes', icon: 'pi pi-paperclip', to: '/' },
        { label: 'Profesores', icon: 'pi pi-fw pi-users', to: '/Profesores' },
        { label: 'Cursos', icon: 'pi pi-pencil', to: '/' },
        { label: 'Historial de calificaciones', icon: 'pi pi-book', to: '/' },
        {
          label: 'Catalogos',
          icon: 'pi pi-fw pi-align-left',
          items: [
            { label: 'Niveles', icon: 'pi pi-fw pi-align-left', to: '/Niveles' },
            { label: 'Turnos', icon: 'pi pi-fw pi-align-left', to:'/Turnos' },
            { label: 'Modelidades', icon: 'pi pi-fw pi-align-left', to:'/Modalidades' },
          ],
        },
      ],
    },
    { separator: true },
  ];

  const menuTeacher = [
    {
      label: 'Menu Profesor',
      icon: 'pi pi-fw pi-home',
      items: [
        { label: 'Subir calificaciones', icon: 'pi pi-sort-numeric-up-alt', to: '/' },
      ],
    },
    { separator: true },
  ];
  const menuStudent = [
    {
      label: 'Menu Alumno',
      icon: 'pi pi-fw pi-home',
      items: [
        { label: 'Mis calificaciones', icon: 'pi pi-chart-line', to: '/' },
        { label: 'Expediente', icon: 'pi pi-fw pi-file-o', to: '/'},
        { label: 'Reconocimientos', icon: 'pi pi-fw pi-star-o', to:'/'}
      ],
    },
    { separator: true },
  ];

  const menu = () => {
    let rolesint = [];
    let menu = [];
    rolesint = [...new Set([...rolesint, ...roles])];
    menu.push(...menuTop);
    rolesint.forEach((element, index) => {
      if (element === 'Student') menu.push(...menuStudent);
      if (element === 'Teacher') menu.push(...menuTeacher);
      if (element === 'Administrator') menu.push(...menuAdmin);
    });
    return menu;
  };

  const routers = [
    {
      path: '/Profesores',
      component: Profesores,
      meta: {
        breadcrumb: [{ parent: 'Administrador', label: 'Profesores' }],
      },
    },
    {
      path: '/Alumnos',
      component: Alumnos,
      meta: {
        breadcrumb: [{ parent: 'Administrador', label: 'Alumnos' }],
      },
    },
    {
      path: '/Niveles',
      component: Niveles,
      meta: {
        breadcrumb: [{ parent: 'Administrador', label: 'Niveles' }],
      },
    },
    {
      path: '/Turnos',
      component: Turnos,
      meta: {
        breadcrumb: [{ parent: 'Administrador', label: 'Turnos' }],
      },
    },
    {
      path: '/Modalidades',
      component: Modalidades,
      meta: {
        breadcrumb: [{ parent: 'Administrador', label: 'Modalidades' }],
      },
    },
    {
      path: '/perfil',
      component: Perfil,
      meta: {
        breadcrumb: [{ label: 'Perfil' }],
      },
    },
    {
      path: '/',
      component: Dashboard,
      exact: true,
      meta: { breadcrumb: [{ parent: 'Inicio', label: 'INICIO' }] },
    },
    
    {
      path: '/home',
      component: Home,
      meta: { breadcrumb: [{ label: 'Inicio/Landing Page' }] },
    },
  ];

  useEffect(() => {
    if (staticMenuMobileActive) {
      blockBodyScroll();
    } else {
      unblockBodyScroll();
    }
  }, [staticMenuMobileActive]);

  const onInputStyleChange = (inputStyle) => {
    setInputStyle(inputStyle);
  };

  const onRippleChange = (e) => {
    PrimeReact.ripple = e.value;
    setRipple(e.value);
  };

  const onDocumentClick = () => {
    if (!searchClick && searchActive) {
      onSearchHide();
    }

    if (!userMenuClick) {
      setTopbarUserMenuActive(false);
    }

    if (!notificationMenuClick) {
      setTopbarNotificationMenuActive(false);
    }

    if (!rightMenuClick) {
      setRightMenuActive(false);
    }

    if (!menuClick) {
      if (isSlim()) {
        setMenuActive(false);
      }

      if (overlayMenuActive || staticMenuMobileActive) {
        hideOverlayMenu();
      }

      unblockBodyScroll();
    }

    if (configActive && !configClick) {
      setConfigActive(false);
    }

    searchClick = false;
    configClick = false;
    userMenuClick = false;
    rightMenuClick = false;
    notificationMenuClick = false;
    menuClick = false;
  };

  const onMenuClick = () => {
    menuClick = true;
  };

  const onMenuButtonClick = (event) => {
    menuClick = true;
    setTopbarUserMenuActive(false);
    setTopbarNotificationMenuActive(false);
    setRightMenuActive(false);

    if (isOverlay()) {
      setOverlayMenuActive((prevOverlayMenuActive) => !prevOverlayMenuActive);
    }

    if (isDesktop()) {
      setStaticMenuDesktopInactive((prevStaticMenuDesktopInactive) => !prevStaticMenuDesktopInactive);
    } else {
      setStaticMenuMobileActive((prevStaticMenuMobileActive) => !prevStaticMenuMobileActive);
    }

    event.preventDefault();
  };

  const onMenuitemClick = (event) => {
    if (!event.item.items) {
      hideOverlayMenu();

      if (isSlim()) {
        setMenuActive(false);
      }
    }
  };

  const onRootMenuitemClick = () => {
    setMenuActive((prevMenuActive) => !prevMenuActive);
  };

  const onTopbarUserMenuButtonClick = (event) => {
    userMenuClick = true;
    setTopbarUserMenuActive((prevTopbarUserMenuActive) => !prevTopbarUserMenuActive);

    hideOverlayMenu();

    event.preventDefault();
  };

  const onTopbarNotificationMenuButtonClick = (event) => {
    notificationMenuClick = true;
    setTopbarNotificationMenuActive((prevTopbarNotificationMenuActive) => !prevTopbarNotificationMenuActive);

    hideOverlayMenu();

    event.preventDefault();
  };

  const toggleSearch = () => {
    setSearchActive((prevSearchActive) => !prevSearchActive);
    searchClick = true;
  };

  const onSearchClick = () => {
    searchClick = true;
  };

  const onSearchHide = () => {
    setSearchActive(false);
    searchClick = false;
  };


  const onRightMenuButtonClick = (event) => {
    rightMenuClick = true;
    setRightMenuActive((prevRightMenuActive) => !prevRightMenuActive);
    hideOverlayMenu();
    event.preventDefault();
  };

  const hideOverlayMenu = () => {
    setOverlayMenuActive(false);
    setStaticMenuMobileActive(false);
    unblockBodyScroll();
  };

  const blockBodyScroll = () => {
    if (document.body.classList) {
      document.body.classList.add('blocked-scroll');
    } else {
      document.body.className += ' blocked-scroll';
    }
  };

  const unblockBodyScroll = () => {
    if (document.body.classList) {
      document.body.classList.remove('blocked-scroll');
    } else {
      document.body.className = document.body.className.replace(new RegExp('(^|\\b)' + 'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
  };

  const isSlim = () => {
    return menuMode === 'slim';
  };

  const isOverlay = () => {
    return menuMode === 'overlay';
  };

  const isDesktop = () => {
    return window.innerWidth > 991;
  };

  const containerClassName = classNames(
    'layout-wrapper',
    {
      'layout-overlay': menuMode === 'overlay',
      'layout-static': menuMode === 'static',
      'layout-slim': menuMode === 'slim',
      'layout-sidebar-dim': colorScheme === 'dim',
      'layout-sidebar-dark': colorScheme === 'dark',
      'layout-overlay-active': overlayMenuActive,
      'layout-mobile-active': staticMenuMobileActive,
      'layout-static-inactive': staticMenuDesktopInactive && menuMode === 'static',
      'p-input-filled': inputStyle === 'filled',
      'p-ripple-disabled': !ripple,
    },
    colorScheme === 'light' ? menuTheme : ''
  );

  return (
    <div className={containerClassName} data-theme={colorScheme} onClick={onDocumentClick}>
      <div className='layout-content-wrapper'>
        <Suspense fallback={<span>loading...</span>}>
          <AppTopBar
            routers={routers}
            topbarNotificationMenuActive={topbarNotificationMenuActive}
            topbarUserMenuActive={topbarUserMenuActive}
            onMenuButtonClick={onMenuButtonClick}
            onSearchClick={toggleSearch}
            onTopbarNotification={onTopbarNotificationMenuButtonClick}
            onTopbarUserMenu={onTopbarUserMenuButtonClick}
            onRightMenuClick={onRightMenuButtonClick}
            onRightMenuButtonClick={onRightMenuButtonClick}
          ></AppTopBar>
        </Suspense>

        <div className='layout-content'>
          {routers.map((router, index) => {
            if (router.exact) {
              return <Route key={`router${index}`} path={router.path} exact component={router.component} />;
            }

            return <Route key={`router${index}`} path={router.path} component={router.component} />;
          })}
        </div>

        <AppFooter />
      </div>

      <AppMenu
        model={menu()}
        menuMode={menuMode}
        active={menuActive}
        mobileMenuActive={staticMenuMobileActive}
        onMenuClick={onMenuClick}
        onMenuitemClick={onMenuitemClick}
        onRootMenuitemClick={onRootMenuitemClick}
      ></AppMenu>

      <AppSearch searchActive={searchActive} onSearchClick={onSearchClick} onSearchHide={onSearchHide} />

      <div className='layout-mask modal-in'></div>
    </div>
  );
};

export default App;
