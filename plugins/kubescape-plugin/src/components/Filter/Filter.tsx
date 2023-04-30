import React, { useContext } from 'react';
import { Grid, makeStyles, Paper, TextField, Theme } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import AppContext from '../../Contexts/AppContext';

const useStyles = makeStyles((theme: Theme) => ({
  bar: {
    padding: theme.spacing(1, 0),
  },
  filters: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  filter: {
    '& + &': {
      marginTop: theme.spacing(2.5),
    },
  },
}));

export const Filter = ({
  namespaces,
  kinds,
  clusters,
  names,
}: {
  namespaces: Array<any>;
  kinds: Array<any>;
  clusters: Array<any>;
  names: Array<any>;
}) => {
  const classes = useStyles();
  const { dispatch, selectedFilters } = useContext(AppContext);

  return (
    <Grid container spacing={3}>
      <Grid item xs={6} sm={3}>
        <Paper className={classes.filters}>
          <Autocomplete
            multiple
            id="tags-outlined"
            options={clusters || []}
            defaultValue={[]}
            filterSelectedOptions
            renderInput={params => (
              <TextField {...params} label="Clusters" placeholder="Clusters" />
            )}
            onChange={(event: any, value: Array<string>, reason: string) => {
              dispatch({
                type: 'SET_SELECTED_FILTERS',
                payload: {
                  selectedFilters: { ...selectedFilters, cluster: value },
                },
              });
            }}
          />
        </Paper>
      </Grid>
      <Grid item xs={6} sm={3}>
        <Paper className={classes.filters}>
          <Autocomplete
            multiple
            id="tags-outlined"
            options={namespaces || []}
            defaultValue={[]}
            filterSelectedOptions
            renderInput={params => (
              <TextField
                {...params}
                label="Namespaces"
                placeholder="Namespaces"
              />
            )}
            onChange={(event: any, value: Array<string>, reason: string) => {
              dispatch({
                type: 'SET_SELECTED_FILTERS',
                payload: {
                  selectedFilters: { ...selectedFilters, namespace: value },
                },
              });
            }}
          />
        </Paper>
      </Grid>

      <Grid item xs={6} sm={3}>
        <Paper className={classes.filters}>
          <Autocomplete
            multiple
            id="tags-outlined"
            options={kinds || []}
            defaultValue={[]}
            filterSelectedOptions
            renderInput={params => (
              <>
                <TextField {...params} label="Kind" placeholder="Kind" />
              </>
            )}
            onChange={(event: any, value: Array<string>, reason: string) => {
              dispatch({
                type: 'SET_SELECTED_FILTERS',
                payload: {
                  selectedFilters: { ...selectedFilters, kind: value },
                },
              });
            }}
          />
        </Paper>
      </Grid>
      <Grid item xs={6} sm={3}>
        <Paper className={classes.filters}>
          <Autocomplete
            multiple
            id="tags-outlined"
            options={names || []}
            defaultValue={[]}
            filterSelectedOptions
            renderInput={params => (
              <TextField {...params} label="Name" placeholder="Name" />
            )}
            onChange={(event: any, value: Array<string>, reason: string) => {
              console.log(value, 'name');
              dispatch({
                type: 'SET_SELECTED_FILTERS',
                payload: {
                  selectedFilters: { ...selectedFilters, name: value },
                },
              });
            }}
          />
        </Paper>
      </Grid>
    </Grid>
  );
};
