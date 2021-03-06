import React, { useEffect } from 'react';
import { Route, useLocation, withRouter, useHistory } from 'react-router-dom';

import { Link } from 'react-router-dom';
import { Button } from 'primereact/button';

import { useKeycloak } from '@react-keycloak/web';

import 'primeicons/primeicons.css';
import './layout/css/landing.css';
import 'primeflex/primeflex.css';

export const Home = () => {
  let location = useLocation();
  const { keycloak, initialized } = useKeycloak();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const history = useHistory();

  const openMenu = () => {
    var wrapper = document.querySelector('.landing-wrapper');
    var body = document.querySelector('.landing-body');
    wrapper.classList.add('landing-menu-active');
    body.classList.add('block-scroll');
  };

  const closeMenu = () => {
    var wrapper = document.querySelector('.landing-wrapper');
    var body = document.querySelector('.landing-body');
    wrapper.classList.remove('landing-menu-active');
    body.classList.remove('block-scroll');
  };

  return (
    <div className='landing-body'>
      <div className='landing-wrapper'>
        <div id='home' className='landing-header'>
          <div className='landing-topbar'>
            <a href='#home'>
              <img src='./assets/images/logo-tesi.png' alt='logo' style={{width:"30%"}} />
            </a>
            <a onClick={openMenu} id='landing-menu-button' tabIndex='0'>
              <i className='pi pi-bars'></i>
            </a>
            <ul className='contact-menu'>
              <li>
                <a href='#contact'>CONTACTO</a>
              </li>
              <li>
                <a href='https://tesi.org.mx' target='_blank'>
                  <i className='pi pi-globe'></i>
                </a>
              </li>
              <li>
                <a href='https://www.facebook.com/TESIOficial' target='_blank'>
                  <i className='pi pi-facebook'></i>
                </a>
              </li>
            </ul>
          </div>
          <div className='landing-header-content'>
            <div className='header-text'>
              <h1>Coordinaci??n de lenguas extrangeras.</h1>

              {keycloak && !keycloak.authenticated && (
                <button className='landing-btn' onClick={() => keycloak.login()}>
                  <span>Ingresar</span>
                </button>
              )}
              {keycloak && keycloak.authenticated && (
                <button className='landing-btn' onClick={() => history.push('/')}>
                  <span>Ingresar</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div id='meetDiamond' className='landing-meetdiamond'>
          <div className='section-title'>
            <h1>TESI</h1>
            <span>
            El Tecnol??gico de Estudios Superiores de Ixtapaluca (TESI), es una Instituci??n P??blica que ofrece educaci??n superior de excelencia, con el fin de formar profesionistas, emprendedores e investigadores competentes, con s??lida preparaci??n cient??fica, tecnol??gica y humanistica, que contribuyan a elevar la calidad de vida de la sociedad.
            <br />    
            El TESI trabaja, esforzandose en todo momento para conservar la m??s alta calidad, con estricta atenci??n y continuidad a las actividades que se llevan a cabo, con el prop??sito de ser un organismo lider.
            </span>
          </div>
        </div>

        <div id='contact' className='landing-contact'>
          <div className='section-title'>
            <h1>Cont??ctanos</h1>
          </div>
          <div className='p-grid' style={{color:"#fff",textAlign: 'center'}}>
            <div className='p-col-4'>
              <h2>Horas de atenci??n</h2>
              <p>
                <b>Lunes - Viernes</b> <br />
                9am - 6pm <br />
              </p>
            </div>
            <div className='p-col-4'>
              <h2>Direcci??n</h2>
              <p>
              Km. 7 de la carretera Ixtapaluca-Coatepec s/n San Juan, Distrito de Coatepec, Ixtapaluca, Estado de M??xico C.P.56580
              </p>
            </div>
            <div className='p-col-4'>
              <h2>Tel??fono</h2>
              <p>
               55 13-14-81-50 
              </p>
            </div>
          </div>
          <div className='landing-footer' style={{marginTop: '150px'}}>
              <h5 style={{color:"#fff"}}>?? Miguel Angel Ord????ez P??rez</h5>
            <div className='social'>
              <a href='https://tesi.org.mx' target='_blank'>
                <i className='pi pi-globe'></i>
              </a>
              <a href='https://www.facebook.com/TESIOficial' target='_blank'>
                <i className='pi pi-facebook'></i>
              </a>
            </div>
          </div>

          <div className='landing-mask'></div>
        </div>
      </div>
    </div>
  );
};
