import React, { useState, useEffect, useRef } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { Button } from 'primereact/button';
import { Carousel } from "primereact/carousel";

import { gql, useQuery } from '@apollo/client';
import 'photoswipe/dist/photoswipe.css'
import 'photoswipe/dist/default-skin/default-skin.css'

import { Gallery, Item } from 'react-photoswipe-gallery'
const anio = new Date().getFullYear();

export const Dashboard = () => {
  const { keycloak, initialized } = useKeycloak();
  const matricula = keycloak.tokenParsed.preferred_username.toUpperCase();

  const userHeader = {
    context: {
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
        'X-Hasura-Role': 'user',
      },
    },
  };

  return (
    <div className='layout-dashboard'>
      <div className='p-grid'>
        <div className='p-col-12 p-md-12 p-xl-12'>
          <div className='card no-gutter widget-overview-box widget-overview-box-4'>
          <Gallery>
            <Item
              original='../assets/images/new1.jpg'
              thumbnail='../assets/images/new1.jpg'
              width="1024"
              height="768"
            >
              {({ ref, open }) => (
                <img ref={ref} onClick={open} style={{width:'30%', marginLeft: '3%'}} src='../assets/images/new1.jpg' />
              )}
            </Item>
            <Item
              original='../assets/images/new2.jpg'
              thumbnail='../assets/images/new2.jpg'
              width="1024"
              height="768"
            >
              {({ ref, open }) => (
                <img ref={ref} onClick={open} style={{width:'30%', marginLeft: '3%'}} src='../assets/images/new2.jpg' />
              )}
            </Item>
            <Item
              original='../assets/images/new3.jpg'
              thumbnail='../assets/images/new3.jpg'
              width="1024"
              height="768"
            >
              {({ ref, open }) => (
                <img ref={ref} onClick={open} style={{width:'30%', marginLeft: '3%'}} src='../assets/images/new3.jpg' />
              )}
            </Item>
          </Gallery>
          </div>
        </div>
      </div>
    </div>
  );
};
