import { useKeycloak } from '@react-keycloak/web';

// import { query, client } from '../graphql-hasura-generated';
// import { query as query2, client as client2 } from '../graphql-hasura-generated';
import { graphql } from '@gqless/react';
import { Suspense } from 'react';

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
import { useHistory } from 'react-router-dom';
import { Card } from 'primereact/card';

import { gql, useQuery, Query, useApolloClient, useMutation, Mutation, useLazyQuery } from '@apollo/client';

// new Logger(client, true);
// new Logger(client2, true);
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
  const curp = keycloak.tokenParsed.preferred_username.toUpperCase();
  const [colors, setcolors] = useState(null);
  const [colorDialog, setcolorDialog] = useState(false);
  const [deletecolorDialog, setdeletecolorDialog] = useState(false);
  const [deletecolorsDialog, setdeletecolorsDialog] = useState(false);
  const [emptycolor, setemptycolor] = useState({
    dato: 'Nuevo color...',
  });
  const [color, setcolor] = useState(emptycolor);
  const [selectedcolors, setselectedcolors] = useState(null);
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
  const [addcolor, { insertmutationData }] = useMutation(insertMutation, administratorHeader);
  const [updatecolor, { updatemutationData }] = useMutation(updateMutation, administratorHeader);
  const [deletecolor, { deletemutationData }] = useMutation(deleteMutation, administratorHeader);
  const [deleteManycolors, { deleteManymutationData }] = useMutation(deleteManyMutation, administratorHeader);
  useEffect(() => {
    setLoading(true);
    // se puede usar el cliente directamente o tambien el hook useLazyQuery
    client.query({ query: MY_QUERY_QUERY, ...administratorHeader }).then((data) => {
      let _colors = data?.data?.catalogoEjemplo?.map((color, index) => {
        return { ...color, numero: index + 1 };
      });
      setcolors(_colors);
      setLoading(false);
    });
  }, []);
  const openNew = () => {
    setcolor(emptycolor);
    setSubmitted(false);
    setcolorDialog(true);
  };
  const hideDialog = () => {
    setSubmitted(false);
    setcolorDialog(false);
    setdeletecolorDialog(false);
    setdeletecolorsDialog(false);
  };
  const savecolor = () => {
    setSubmitted(true);
    if (color.dato) {
      let _colors = [...colors];
      let _color = { ...color };
      delete _color.numero;
      //EDITAR/ACTUALIZAR
      if (color.id) {
        updatecolor({
          variables: { id: _color.id, _set: _color },
        }).then((data) => {
          const index = findIndexById(data.data.update_catalogoEjemplo_by_pk.id);
          _colors[index] = data.data.update_catalogoEjemplo_by_pk;
          _colors = _colors.map((color, index) => {
            return { ...color, numero: index + 1 };
          });
          setcolors(_colors);
          toast.current.show({
            severity: 'success',
            summary: 'Éxito',
            detail: 'color Actualizado',
            life: 3000,
          });
        });
        //Insertar NUEVO
      } else {
        addcolor({
          variables: { object: _color },
        })
          .then((data) => {
            _colors.push(data.data.insert_catalogoEjemplo_one);
            _colors = _colors.map((color, index) => {
              return { ...color, numero: index + 1 };
            });
            setcolors(_colors);
            toast.current.show({
              severity: 'success',
              summary: 'Éxito',
              detail: 'color Guardado',
              life: 3000,
            });
          })
          .catch((e) => {
            console.log(e);
          });
      }
      setcolorDialog(false);
      setcolor(emptycolor);
    } else {
      toast.current.show({
        severity: 'error',
        summary: 'Datos faltantes',
        detail: 'Por favor revise los datos faltantes',
        life: 3000,
      });
    }
  };
  const editcolor = (color) => {
    setcolor({ ...color });
    setcolorDialog(true);
  };
  const confirmdeletecolor = (color) => {
    setcolor(color);
    setdeletecolorDialog(true);
  };
  const deleteCOLOR = () => {
    deletecolor({ variables: { id: color.id } }).then((data) => {
      let _colors = colors
        .filter((val) => val.id !== color.id)
        .map((color, index) => {
          return { ...color, numero: index + 1 };
        });
      setcolors(_colors);
      setdeletecolorDialog(false);
      setcolor(emptycolor);
      toast.current.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'color Eliminado',
        life: 3000,
      });
    });
  };
  const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < colors.length; i++) {
      if (colors[i].id === id) {
        index = i;
        break;
      }
    }
    return index;
  };
  const confirmDeleteSelected = () => {
    setdeletecolorsDialog(true);
  };
  const deleteSelectedcolor = () => {
    let idsArray = selectedcolors.map(function (del) {
      return del.id;
    });
    deleteManycolors({ variables: { _in: idsArray } }).then((data) => {
      let _colors = colors
        .filter((val) => !selectedcolors.includes(val))
        .map((color, index) => {
          return { ...color, numero: index + 1 };
        });
      setcolors(_colors);
      setdeletecolorsDialog(false);
      setselectedcolors(null);
      toast.current.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'color Eliminados',
        life: 3000,
      });
    });
  };
  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _color = { ...color };
    _color[`${name}`] = val;
    setcolor(_color);
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
          disabled={!selectedcolors || !selectedcolors.length}
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
        <Button icon='pi pi-pencil' className='p-button-rounded p-button-success p-mr-2' onClick={() => editcolor(rowData)} />
        <Button icon='pi pi-trash' className='p-button-rounded p-button-warning' onClick={() => confirmdeletecolor(rowData)} />
      </div>
    );
  };
  const header = () => {
    return (
      <div className='p-grid'>
        <div className='p-col-11'>
          <h5 className='p-m-0'>Administración de colores</h5>
          <span className='p-input-icon-left'>
            <i className='pi pi-search' />
            <InputText type='search' onInput={(e) => setGlobalFilter(e.target.value)} placeholder='Buscar...' />
          </span>
        </div>
      </div>
    );
  };
  const colorDialogFooter = (
    <>
      <Button label='Cancelar' icon='pi pi-times' className='p-button-text' onClick={hideDialog} />
      <Button label='Guardar' icon='pi pi-check' onClick={savecolor} />
    </>
  );
  const deletecolorDialogFooter = (
    <>
      <Button label='No' icon='pi pi-times' className='p-button-text' onClick={hideDialog} />
      <Button label='Si' icon='pi pi-check' onClick={deleteCOLOR} />
    </>
  );
  const deletecolorsDialogFooter = (
    <>
      <Button label='No' icon='pi pi-times' className='p-button-text' onClick={hideDialog} />
      <Button label='Si' icon='pi pi-check' onClick={deleteSelectedcolor} />
    </>
  );
  return (
    <div>
      <div className='p-grid'>
        <div className='p-col-12'>
          <Card title='Registrar color' className='card no-gutter widget-overview-box widget-overview-box-1'>
            {/* <MyQueryQuery></MyQueryQuery> */}
            <Toast ref={toast} />
            {!loading && (
              <>
                <Toolbar className='p-mb-4' left={leftToolbarTemplate}></Toolbar>

                <DataTable
                  ref={dt}
                  value={colors}
                  selection={selectedcolors}
                  onSelectionChange={(e) => setselectedcolors(e.value)}
                  dataKey='id'
                  paginator
                  rows={10}
                  rowsPerPageOptions={[5, 10, 25]}
                  className='datatable-responsive'
                  paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
                  currentPageReportTemplate='Mostrando de {first} a {last} de un total de {totalRecords} registros'
                  globalFilter={globalFilter}
                  emptyMessage='No color registrados.'
                  header={header()}
                  //exportFunction={exportFunction}
                >
                  <Column selectionMode='multiple' headerStyle={{ width: '5%' }} />
                  <Column field='numero' header='Num' body={onIndexTemplate} headerStyle={{ width: '10%' }} />
                  <Column field='id' header='id' headerStyle={{ width: '10%' }} />
                  <Column field='dato' header='color' headerStyle={{ width: '70%' }} />
                  <Column body={actionBodyTemplate} headerStyle={{ width: '15%' }} />
                </DataTable>
              </>
            )}
            <Dialog visible={colorDialog} header='color' modal style={{ width: '50vw' }} className='p-fluid' footer={colorDialogFooter} onHide={hideDialog}>
              <div className='p-field'>
                <label htmlFor='color'>color</label>
                <InputTextarea
                  id='color'
                  value={color.dato}
                  onChange={(e) => onInputChange(e, 'dato')}
                  required={true}
                  rows={3}
                  cols={20}
                  className={classNames({
                    'p-invalid': submitted && !color?.dato,
                  })}
                />
                {submitted && !color?.dato && <medium className='p-invalid'>Se requiere la Descripción.</medium>}
              </div>
            </Dialog>
            <Dialog visible={deletecolorDialog} style={{ width: '450px' }} header='Confirmación' modal footer={deletecolorDialogFooter} onHide={hideDialog}>
              <div className='p-d-flex p-ai-center p-jc-center'>
                <i className='pi pi-exclamation-triangle p-mr-3' style={{ fontSize: '2rem' }} />
                {color && (
                  <span>
                    ¿Estas seguro de borrar este color: <b>{color.numero + '.-' + color.dato}</b>?
                  </span>
                )}
              </div>
            </Dialog>
            <Dialog visible={deletecolorsDialog} style={{ width: '450px' }} header='Confirmación' modal footer={deletecolorsDialogFooter} onHide={hideDialog}>
              <div className='p-d-flex p-ai-center p-jc-center'>
                <i className='pi pi-exclamation-triangle p-mr-3' style={{ fontSize: '2rem' }} />
                {color && <span>¿Estas seguro de borrar los colores seleccionados?</span>}
              </div>
            </Dialog>
          </Card>
        </div>
      </div>
    </div>
  );
});
