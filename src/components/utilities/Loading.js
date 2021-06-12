import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import '../../index.css';
import '../../App.scss';

import React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';

export const Loading = () => {
    return (
        <div className="container">
            <div className="col-md-12" style={{paddingTop:'10%'}}>
                <center>
                <h1 style={{marginBottom:'50px'}}>Cargando...</h1>
                <ProgressSpinner />
                </center>
            </div>
        </div>
    );
}
                