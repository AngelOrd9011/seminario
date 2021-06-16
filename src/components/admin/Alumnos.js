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
import { Card } from 'primereact/card';

import { gql, useQuery, Query, useApolloClient, useMutation, Mutation, useLazyQuery } from '@apollo/client';

const updateMutation = gql`
  mutation MyUpdateMutation($id: Int!, $_set: view_students_set_input!) {
    update_view_students_by_pk(pk_columns: { id: $id }, _set: $_set) {
      id
      username
    }
  }
`;
const insertMutation = gql`
  mutation MyInsertMutation($object: view_students_insert_input!) {
    insert_view_students_one(object: $object) {
      id
      username
    }
  }
`;
const MY_QUERY_QUERY = gql`
  query {
    view_students {
      id
      username
    }
  }
`;

const deleteMutation = gql`
  mutation MyDeleteMutation($id: Int!) {
    delete_view_students_by_pk(id: $id) {
      id
    }
  }
`;
const deleteManyMutation = gql`
  mutation MyDeleteManyMutation($_in: [Int!]!) {
    delete_view_students(where: { id: { _in: $_in } }) {
      affected_rows
    }
  }
`;
export const Alumnos = graphql(() => {
  const [loading, setLoading] = useState(true);
  const client = useApolloClient();
  const { keycloak, initialized } = useKeycloak();
  const [entities, setEntities] = useState(null);
  const [entityDialog, setEntityDialog] = useState(false);
  const [deleteEntityDialog, setDeleteEntityDialog] = useState(false);
  const [deleteEntitiesDialog, setDeleteEntitiesDialog] = useState(false);
  const [emptyEntity, setEmptyEntity] = useState({
    username: '',
  });
  const [entity, setEntity] = useState(emptyEntity);
  const [selectedEntities, setselectedEntities] = useState(null);
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
  const [addEntity, { insertmutationData }] = useMutation(insertMutation, administratorHeader);
  const [updateEntity, { updatemutationData }] = useMutation(updateMutation, administratorHeader);
  const [deleteEntity, { deletemutationData }] = useMutation(deleteMutation, administratorHeader);
  const [deleteManyEntities, { deleteManymutationData }] = useMutation(deleteManyMutation, administratorHeader);
  useEffect(() => {
    setLoading(true);
    // se puede usar el cliente directamente o tambien el hook useLazyQuery
    client.query({ query: MY_QUERY_QUERY, ...administratorHeader }).then((data) => {
      let _entities = data?.data?.view_students?.map((entity, index) => {
        return { ...entity, numero: index + 1 };
      });
      setEntities(_entities);
      setLoading(false);
    });
  }, []);
  const openNew = () => {
    setEntity(emptyEntity);
    setSubmitted(false);
    setEntityDialog(true);
  };
  const hideDialog = () => {
    setSubmitted(false);
    setEntityDialog(false);
    setDeleteEntityDialog(false);
    setDeleteEntitiesDialog(false);
  };
  const saveEntity = () => {
    setSubmitted(true);
    if (entity.username) {
      let _entities = [...entities];
      let _entity = { ...entity };
      delete _entity.numero;
      //EDITAR/ACTUALIZAR
      if (entity.id) {
        updateEntity({
          variables: { id: _entity.id, _set: _entity },
        }).then((data) => {
          const index = findIndexById(data.data.update_view_students_by_pk.id);
          _entities[index] = data.data.update_view_students_by_pk;
          _entities = _entities.map((entity, index) => {
            return { ...entity, numero: index + 1 };
          });
          setEntities(_entities);
          toast.current.show({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Alumno actualizado',
            life: 3000,
          });
        });
        //Insertar NUEVO
      } else {
        addEntity({
          variables: { object: _entity },
        })
          .then((data) => {
            _entities.push(data.data.insert_view_students_one);
            _entities = _entities.map((entity, index) => {
              return { ...entity, numero: index + 1 };
            });
            setEntities(_entities);
            toast.current.show({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Alumno guardado',
              life: 3000,
            });
          })
          .catch((e) => {
            console.log(e);
          });
      }
      setEntityDialog(false);
      setEntity(emptyEntity);
    } else {
      toast.current.show({
        severity: 'error',
        summary: 'Datos faltantes',
        detail: 'Por favor revise los datos faltantes',
        life: 3000,
      });
    }
  };
  const editEntity = (entity) => {
    setEntity({ ...entity });
    setEntityDialog(true);
  };
  const confirmDeleteEntity = (entity) => {
    setEntity(entity);
    setDeleteEntityDialog(true);
  };
  const deleteEntityConfirmed = () => {
    deleteEntity({ variables: { id: entity.id } }).then((data) => {
      let _entities = entities
        .filter((val) => val.id !== entity.id)
        .map((entity, index) => {
          return { ...entity, numero: index + 1 };
        });
      setEntities(_entities);
      setDeleteEntityDialog(false);
      setEntity(emptyEntity);
      toast.current.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Alumno eliminado',
        life: 3000,
      });
    });
  };
  const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < entities.length; i++) {
      if (entities[i].id === id) {
        index = i;
        break;
      }
    }
    return index;
  };
  const confirmDeleteSelected = () => {
    setDeleteEntitiesDialog(true);
  };
  const deleteSelectedEntity = () => {
    let idsArray = selectedEntities.map(function (del) {
      return del.id;
    });
    deleteManyEntities({ variables: { _in: idsArray } }).then((data) => {
      let _entities = entities
        .filter((val) => !selectedEntities.includes(val))
        .map((entity, index) => {
          return { ...entity, numero: index + 1 };
        });
      setEntities(_entities);
      setDeleteEntitiesDialog(false);
      setselectedEntities(null);
      toast.current.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Alumnos eliminados',
        life: 3000,
      });
    });
  };
  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _entity = { ...entity };
    _entity[`${name}`] = val;
    setEntity(_entity);
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
          disabled={!selectedEntities || !selectedEntities.length}
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
        <Button icon='pi pi-pencil' className='p-button-rounded p-button-success p-mr-2' onClick={() => editEntity(rowData)} />
        <Button icon='pi pi-trash' className='p-button-rounded p-button-danger' onClick={() => confirmDeleteEntity(rowData)} />
      </div>
    );
  };
  const header = () => {
    return (
      <div className='p-grid'>
        <div className='p-col-11'>
          <span className='p-input-icon-left'>
            <i className='pi pi-search' />
            <InputText type='search' onInput={(e) => setGlobalFilter(e.target.value)} placeholder='Buscar...' />
          </span>
        </div>
      </div>
    );
  };
  const entityDialogFooter = (
    <>
      <Button label='Cancelar' icon='pi pi-times' className='p-button-text p-button-danger' onClick={hideDialog} />
      <Button label='Guardar' icon='pi pi-check' onClick={saveEntity} />
    </>
  );
  const deleteEntityDialogFooter = (
    <>
      <Button label='No' icon='pi pi-times' className='p-button-text p-button-info' onClick={hideDialog} />
      <Button label='Si' icon='pi pi-check' className='p-button-danger' onClick={deleteEntityConfirmed} />
    </>
  );
  const deleteEntitiesDialogFooter = (
    <>
      <Button label='No' icon='pi pi-times' className='p-button-text p-button-info' onClick={hideDialog} />
      <Button label='Si' icon='pi pi-check' className='p-button-danger' onClick={deleteSelectedEntity} />
    </>
  );
  return (
    <div>
      <div className='p-grid'>
        <div className='p-col-12'>
          <Card title='Administración de Alumnos' className='card no-gutter widget-overview-box widget-overview-box-1'>
            {/* <MyQueryQuery></MyQueryQuery> */}
            <Toast ref={toast} />
            {!loading && (
              <>
                <Toolbar className='p-mb-4' left={leftToolbarTemplate}></Toolbar>

                <DataTable
                  ref={dt}
                  value={entities}
                  selection={selectedEntities}
                  onSelectionChange={(e) => setselectedEntities(e.value)}
                  dataKey='id'
                  paginator
                  rows={10}
                  rowsPerPageOptions={[5, 10, 25]}
                  className='datatable-responsive'
                  paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
                  currentPageReportTemplate='Mostrando de {first} a {last} de un total de {totalRecords} registros'
                  globalFilter={globalFilter}
                  emptyMessage='No hay alumnos registrados.'
                  header={header()}
                  //exportFunction={exportFunction}
                >
                  <Column selectionMode='multiple' headerStyle={{ width: '10%' }} />
                  <Column field='numero' header='#' body={onIndexTemplate} headerStyle={{ width: '10%' }} />
                  <Column field='id' header='id' style={{ width: '0%', display: 'none'}} hidden='true' />
                  <Column field='username' header='Matricula' headerStyle={{ width: '20%' }} />
                  <Column header='Nombre' headerStyle={{width:'30%'}}/>
                  <Column body={actionBodyTemplate} headerStyle={{ width: '20%' }} />
                </DataTable>
              </>
            )}
            <Dialog visible={entityDialog} header='Alumno' modal style={{ width: '50vw' }} className='p-fluid' footer={entityDialogFooter} onHide={hideDialog}>
              <div className='p-field'>
                <label htmlFor='entity'>Matricula:</label>
                <InputText
                  id='entity'
                  value={entity.username}
                  onChange={(e) => onInputChange(e, 'username')}
                  required={true}
                  rows={3}
                  cols={20}
                  className={classNames({
                    'p-invalid': submitted && !entity?.username,
                  })}
                />
                {submitted && !entity?.username && <medium className='p-invalid'>Se requiere la matricula del alumno.</medium>}
              </div>
            </Dialog>
            <Dialog visible={deleteEntityDialog} style={{ width: '450px' }} header='Confirmación' modal footer={deleteEntityDialogFooter} onHide={hideDialog}>
              <div className='p-d-flex p-ai-center p-jc-center'>
                <i className='pi pi-exclamation-triangle p-mr-3' style={{ fontSize: '2rem' }} />
                {entity && (
                  <span>
                    ¿Estas seguro de borrar este alumno: <b>{entity.numero + '.-' + entity.username}</b>?
                  </span>
                )}
              </div>
            </Dialog>
            <Dialog visible={deleteEntitiesDialog} style={{ width: '450px' }} header='Confirmación' modal footer={deleteEntitiesDialogFooter} onHide={hideDialog}>
              <div className='p-d-flex p-ai-center p-jc-center'>
                <i className='pi pi-exclamation-triangle p-mr-3' style={{ fontSize: '2rem' }} />
                {entity && <span>¿Estas seguro de borrar los alumnos seleccionados?</span>}
              </div>
            </Dialog>
          </Card>
        </div>
      </div>
    </div>
  );
});