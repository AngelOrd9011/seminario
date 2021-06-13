import { useKeycloak } from '@react-keycloak/web';
import { graphql } from '@gqless/react';
import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { Card } from 'primereact/card';

import { gql, useQuery, Query, useApolloClient, useMutation, Mutation, useLazyQuery } from '@apollo/client';

const updateMutation = gql`
  mutation MyUpdateMutation($id: Int!, $_set: catalogoEjemplo_set_input!) {
    update_catalogoEjemplo_by_pk(pk_columns: { id: $id }, _set: $_set) {
      id
      dato
    }
  }
`;
const insertMutation = gql`
  mutation MyInsertMutation($object: catalogoEjemplo_insert_input!) {
    insert_catalogoEjemplo_one(object: $object) {
      id
      dato
    }
  }
`;
const MY_QUERY_QUERY = gql`
  query {
    catalogoEjemplo {
      id
      dato
    }
  }
`;

const deleteMutation = gql`
  mutation MyDeleteMutation($id: Int!) {
    delete_catalogoEjemplo_by_pk(id: $id) {
      id
    }
  }
`;
const deleteManyMutation = gql`
  mutation MyDeleteManyMutation($_in: [Int!]!) {
    delete_catalogoEjemplo(where: { id: { _in: $_in } }) {
      affected_rows
    }
  }
`;
export const Catalogo1 = graphql(() => {
  const [loading, setLoading] = useState(true);
  const client = useApolloClient();
  const { keycloak, initialized } = useKeycloak();
  const matricula = keycloak.tokenParsed.preferred_username.toUpperCase();
  const [maestros, setmaestros] = useState(null);
  const [maestroDialog, setmaestroDialog] = useState(false);
  const [deletemaestroDialog, setdeletemaestroDialog] = useState(false);
  const [deletemaestrosDialog, setdeletemaestrosDialog] = useState(false);
  const [emptymaestro, setemptymaestro] = useState({
    dato: 'Nuevo maestro...',
  });
  const [maestro, setmaestro] = useState(emptymaestro);
  const [selectedmaestros, setselectedmaestros] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const otroRef = useRef(null);
  const dt = useRef(null);
  const administratorHeader = {
    context: {
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
        'X-Hasura-Role': 'Administrator',
      },
    },
  };
  //se tiene que pasar el rol con el que pueden hacer mutaciones ademas del token JWT
  const [addmaestro, { insertmutationData }] = useMutation(insertMutation, administratorHeader);
  const [updatemaestro, { updatemutationData }] = useMutation(updateMutation, administratorHeader);
  const [deletemaestro, { deletemutationData }] = useMutation(deleteMutation, administratorHeader);
  const [deleteManymaestros, { deleteManymutationData }] = useMutation(deleteManyMutation, administratorHeader);
  useEffect(() => {
    setLoading(true);
    // se puede usar el cliente directamente o tambien el hook useLazyQuery
    client.query({ query: MY_QUERY_QUERY, ...administratorHeader }).then((data) => {
      let _maestros = data?.data?.catalogoEjemplo?.map((maestro, index) => {
        return { ...maestro, numero: index + 1 };
      });
      setmaestros(_maestros);
      setLoading(false);
    });
  }, []);
  const openNew = () => {
    setmaestro(emptymaestro);
    setSubmitted(false);
    setmaestroDialog(true);
  };
  const hideDialog = () => {
    setSubmitted(false);
    setmaestroDialog(false);
    setdeletemaestroDialog(false);
    setdeletemaestrosDialog(false);
  };
  const savemaestro = () => {
    setSubmitted(true);
    if (maestro.dato) {
      let _maestros = [...maestros];
      let _maestro = { ...maestro };
      delete _maestro.numero;
      //EDITAR/ACTUALIZAR
      if (maestro.id) {
        updatemaestro({
          variables: { id: _maestro.id, _set: _maestro },
        }).then((data) => {
          const index = findIndexById(data.data.update_catalogoEjemplo_by_pk.id);
          _maestros[index] = data.data.update_catalogoEjemplo_by_pk;
          _maestros = _maestros.map((maestro, index) => {
            return { ...maestro, numero: index + 1 };
          });
          setmaestros(_maestros);
          toast.current.show({
            severity: 'success',
            summary: 'Éxito',
            detail: 'maestro Actualizado',
            life: 3000,
          });
        });
        //Insertar NUEVO
      } else {
        addmaestro({
          variables: { object: _maestro },
        })
          .then((data) => {
            _maestros.push(data.data.insert_catalogoEjemplo_one);
            _maestros = _maestros.map((maestro, index) => {
              return { ...maestro, numero: index + 1 };
            });
            setmaestros(_maestros);
            toast.current.show({
              severity: 'success',
              summary: 'Éxito',
              detail: 'maestro Guardado',
              life: 3000,
            });
          })
          .catch((e) => {
            console.log(e);
          });
      }
      setmaestroDialog(false);
      setmaestro(emptymaestro);
    } else {
      toast.current.show({
        severity: 'error',
        summary: 'Datos faltantes',
        detail: 'Por favor revise los datos faltantes',
        life: 3000,
      });
    }
  };
  const editmaestro = (maestro) => {
    setmaestro({ ...maestro });
    setmaestroDialog(true);
  };
  const confirmdeletemaestro = (maestro) => {
    setmaestro(maestro);
    setdeletemaestroDialog(true);
  };
  const deletemaestroConfirmed = () => {
    deletemaestro({ variables: { id: maestro.id } }).then((data) => {
      let _maestros = maestros
        .filter((val) => val.id !== maestro.id)
        .map((maestro, index) => {
          return { ...maestro, numero: index + 1 };
        });
      setmaestros(_maestros);
      setdeletemaestroDialog(false);
      setmaestro(emptymaestro);
      toast.current.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'maestro Eliminado',
        life: 3000,
      });
    });
  };
  const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < maestros.length; i++) {
      if (maestros[i].id === id) {
        index = i;
        break;
      }
    }
    return index;
  };
  const confirmDeleteSelected = () => {
    setdeletemaestrosDialog(true);
  };
  const deleteSelectedmaestro = () => {
    let idsArray = selectedmaestros.map(function (del) {
      return del.id;
    });
    deleteManymaestros({ variables: { _in: idsArray } }).then((data) => {
      let _maestros = maestros
        .filter((val) => !selectedmaestros.includes(val))
        .map((maestro, index) => {
          return { ...maestro, numero: index + 1 };
        });
      setmaestros(_maestros);
      setdeletemaestrosDialog(false);
      setselectedmaestros(null);
      toast.current.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'maestro Eliminados',
        life: 3000,
      });
    });
  };
  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _maestro = { ...maestro };
    _maestro[`${name}`] = val;
    setmaestro(_maestro);
  };
  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button label='Agregar' icon='pi pi-plus' className='p-button-success p-mr-2' onClick={openNew} />
        <Button
          label='Eliminar'
          icon='pi pi-trash'
          className='p-button-danger'
          onClick={confirmDeleteSelected}
          disabled={!selectedmaestros || !selectedmaestros.length}
        />
      </React.Fragment>
    );
  };
  const onIndexTemplate = (data, props) => {
    return props.rowIndex + 1;
    //return data.numero;
  };
  const actionBodyTemplate = (rowData) => {
    return (
      <div className='actions'>
        <Button icon='pi pi-pencil' className='p-button-rounded p-button-success p-mr-2' onClick={() => editmaestro(rowData)} />
        <Button icon='pi pi-trash' className='p-button-rounded p-button-danger' onClick={() => confirmdeletemaestro(rowData)} />
      </div>
    );
  };
  const header = () => {
    return (
      <div className='p-grid'>
        <div className='p-col-11'>
          <h5 className='p-m-0'>Administración de maestroes</h5>
          <span className='p-input-icon-left'>
            <i className='pi pi-search' />
            <InputText type='search' onInput={(e) => setGlobalFilter(e.target.value)} placeholder='Buscar...' />
          </span>
        </div>
      </div>
    );
  };
  const maestroDialogFooter = (
    <>
      <Button label='Cancelar' icon='pi pi-times' className='p-button-text p-button-danger' onClick={hideDialog} />
      <Button label='Guardar' icon='pi pi-check' onClick={savemaestro} />
    </>
  );
  const deletemaestroDialogFooter = (
    <>
      <Button label='No' icon='pi pi-times' className='p-button-text p-button-info' onClick={hideDialog} />
      <Button label='Si' icon='pi pi-check' className='p-button-danger' onClick={deletemaestroConfirmed} />
    </>
  );
  const deletemaestrosDialogFooter = (
    <>
      <Button label='No' icon='pi pi-times' className='p-button-text p-button-info' onClick={hideDialog} />
      <Button label='Si' icon='pi pi-check' className='p-button-danger' onClick={deleteSelectedmaestro} />
    </>
  );
  return (
    <div>
      <div className='p-grid'>
        <div className='p-col-12'>
          <Card title='Registrar maestro' className='card no-gutter widget-overview-box widget-overview-box-1'>
            {/* <MyQueryQuery></MyQueryQuery> */}
            <Toast ref={toast} />
            {!loading && (
              <>
                <Toolbar className='p-mb-4' left={leftToolbarTemplate}></Toolbar>

                <DataTable
                  ref={dt}
                  value={maestros}
                  selection={selectedmaestros}
                  onSelectionChange={(e) => setselectedmaestros(e.value)}
                  dataKey='id'
                  paginator
                  rows={10}
                  rowsPerPageOptions={[5, 10, 25]}
                  className='datatable-responsive'
                  paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
                  currentPageReportTemplate='Mostrando de {first} a {last} de un total de {totalRecords} registros'
                  globalFilter={globalFilter}
                  emptyMessage='No maestro registrados.'
                  header={header()}
                  //exportFunction={exportFunction}
                >
                  <Column selectionMode='multiple' headerStyle={{ width: '5%' }} />
                  <Column field='numero' header='Num' body={onIndexTemplate} headerStyle={{ width: '10%' }} />
                  <Column field='id' header='id' headerStyle={{ width: '10%' }} />
                  <Column field='dato' header='maestro' headerStyle={{ width: '70%' }} />
                  <Column body={actionBodyTemplate} headerStyle={{ width: '15%' }} />
                </DataTable>
              </>
            )}
            <Dialog visible={maestroDialog} header='maestro' modal style={{ width: '50vw' }} className='p-fluid' footer={maestroDialogFooter} onHide={hideDialog}>
              <div className='p-field'>
                <label htmlFor='maestro'>maestro</label>
                <InputTextarea
                  id='maestro'
                  value={maestro.dato}
                  onChange={(e) => onInputChange(e, 'dato')}
                  required={true}
                  rows={3}
                  cols={20}
                  className={classNames({
                    'p-invalid': submitted && !maestro?.dato,
                  })}
                />
                {submitted && !maestro?.dato && <medium className='p-invalid'>Se requiere la Descripción.</medium>}
              </div>
            </Dialog>
            <Dialog visible={deletemaestroDialog} style={{ width: '450px' }} header='Confirmación' modal footer={deletemaestroDialogFooter} onHide={hideDialog}>
              <div className='p-d-flex p-ai-center p-jc-center'>
                <i className='pi pi-exclamation-triangle p-mr-3' style={{ fontSize: '2rem' }} />
                {maestro && (
                  <span>
                    ¿Estas seguro de borrar este maestro: <b>{maestro.numero + '.-' + maestro.dato}</b>?
                  </span>
                )}
              </div>
            </Dialog>
            <Dialog visible={deletemaestrosDialog} style={{ width: '450px' }} header='Confirmación' modal footer={deletemaestrosDialogFooter} onHide={hideDialog}>
              <div className='p-d-flex p-ai-center p-jc-center'>
                <i className='pi pi-exclamation-triangle p-mr-3' style={{ fontSize: '2rem' }} />
                {maestro && <span>¿Estas seguro de borrar los maestroes seleccionados?</span>}
              </div>
            </Dialog>
          </Card>
        </div>
      </div>
    </div>
  );
});
