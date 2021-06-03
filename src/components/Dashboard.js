import React, { useState, useEffect, useRef } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { Button } from 'primereact/button';
import { Carousel } from "primereact/carousel";
import { ProgressSpinner } from 'primereact/progressspinner';

import { gql, useQuery } from '@apollo/client';
import 'photoswipe/dist/photoswipe.css'
import 'photoswipe/dist/default-skin/default-skin.css'

import { Gallery, Item } from 'react-photoswipe-gallery'
const anio = new Date().getFullYear();

export const Dashboard = () => {
  const { keycloak, initialized } = useKeycloak();
  const curp = keycloak.tokenParsed.preferred_username.toUpperCase();

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
              original="https://scontent.fmex3-1.fna.fbcdn.net/v/t1.6435-9/189412155_777205606312313_2165468961458449843_n.jpg?_nc_cat=100&ccb=1-3&_nc_sid=730e14&_nc_ohc=j00ZLLDHli0AX-On5GF&_nc_ht=scontent.fmex3-1.fna&oh=663f76585976a6c5c5f514ed5bd94df9&oe=60D75104"
              thumbnail="https://scontent.fmex3-1.fna.fbcdn.net/v/t1.6435-9/189412155_777205606312313_2165468961458449843_n.jpg?_nc_cat=100&ccb=1-3&_nc_sid=730e14&_nc_ohc=j00ZLLDHli0AX-On5GF&_nc_ht=scontent.fmex3-1.fna&oh=663f76585976a6c5c5f514ed5bd94df9&oe=60D75104"
              width="1024"
              height="768"
            >
              {({ ref, open }) => (
                <img ref={ref} onClick={open} style={{width:'30%', marginLeft: '3%'}} src="https://scontent.fmex3-1.fna.fbcdn.net/v/t1.6435-9/189412155_777205606312313_2165468961458449843_n.jpg?_nc_cat=100&ccb=1-3&_nc_sid=730e14&_nc_ohc=j00ZLLDHli0AX-On5GF&_nc_ht=scontent.fmex3-1.fna&oh=663f76585976a6c5c5f514ed5bd94df9&oe=60D75104" />
              )}
            </Item>
            <Item
              original="https://scontent.fmex3-1.fna.fbcdn.net/v/t1.6435-9/186488027_776721349694072_9036604911438024176_n.jpg?_nc_cat=103&ccb=1-3&_nc_sid=730e14&_nc_ohc=oZw7s5cA_TEAX_8d2_U&_nc_ht=scontent.fmex3-1.fna&oh=659f688f173a2fa2c1dbebeb5d1f8ad5&oe=60D75166"
              thumbnail="https://scontent.fmex3-1.fna.fbcdn.net/v/t1.6435-9/186488027_776721349694072_9036604911438024176_n.jpg?_nc_cat=103&ccb=1-3&_nc_sid=730e14&_nc_ohc=oZw7s5cA_TEAX_8d2_U&_nc_ht=scontent.fmex3-1.fna&oh=659f688f173a2fa2c1dbebeb5d1f8ad5&oe=60D75166"
              width="1024"
              height="768"
            >
              {({ ref, open }) => (
                <img ref={ref} onClick={open} style={{width:'30%', marginLeft: '3%'}} src="https://scontent.fmex3-1.fna.fbcdn.net/v/t1.6435-9/186488027_776721349694072_9036604911438024176_n.jpg?_nc_cat=103&ccb=1-3&_nc_sid=730e14&_nc_ohc=oZw7s5cA_TEAX_8d2_U&_nc_ht=scontent.fmex3-1.fna&oh=659f688f173a2fa2c1dbebeb5d1f8ad5&oe=60D75166" />
              )}
            </Item>
            <Item
              original="https://scontent.fmex3-1.fna.fbcdn.net/v/t1.6435-9/190319145_776693123030228_1434543017933383810_n.jpg?_nc_cat=103&ccb=1-3&_nc_sid=730e14&_nc_ohc=mYK3vz97wW4AX_Ol9Ds&_nc_ht=scontent.fmex3-1.fna&oh=af2a98b9e8e6da3c6155f71a345315da&oe=60D7F7C8"
              thumbnail="https://scontent.fmex3-1.fna.fbcdn.net/v/t1.6435-9/190319145_776693123030228_1434543017933383810_n.jpg?_nc_cat=103&ccb=1-3&_nc_sid=730e14&_nc_ohc=mYK3vz97wW4AX_Ol9Ds&_nc_ht=scontent.fmex3-1.fna&oh=af2a98b9e8e6da3c6155f71a345315da&oe=60D7F7C8"
              width="1024"
              height="768"
            >
              {({ ref, open }) => (
                <img ref={ref} onClick={open} style={{width:'30%', marginLeft: '3%'}} src="https://scontent.fmex3-1.fna.fbcdn.net/v/t1.6435-9/190319145_776693123030228_1434543017933383810_n.jpg?_nc_cat=103&ccb=1-3&_nc_sid=730e14&_nc_ohc=mYK3vz97wW4AX_Ol9Ds&_nc_ht=scontent.fmex3-1.fna&oh=af2a98b9e8e6da3c6155f71a345315da&oe=60D7F7C8" />
              )}
            </Item>
          </Gallery>
          </div>
        </div>
      </div>
    </div>
  );
};
