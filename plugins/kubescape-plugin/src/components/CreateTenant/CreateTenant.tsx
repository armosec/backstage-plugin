import React, { useState } from 'react';
import { Box, Button, makeStyles, TextField } from '@material-ui/core';
import { useApi } from '@backstage/core-plugin-api';
import { myAwesomeApiRef } from '../../api';
import armoImage from '../../Utils/wizard_success.png';

const useStyles = makeStyles({
  createTenant: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  submitButton: {
    marginTop: '20px',
  },
  image: {
    position: 'relative',
    left: '200px',
  },
});
const CreateTenant = ({
  userId,
  setIsTenantCreated,
}: {
  userId: string;
  setIsTenantCreated: (val: boolean) => void;
}) => {
  const classes = useStyles();
  const [tenantName, setTenantName] = useState('');
  const apiClient = useApi(myAwesomeApiRef);
  const handleCreateTenant = async (e: any) => {
    e.preventDefault();
    await apiClient.createTenant({ customerName: tenantName, userId });
    setIsTenantCreated(!!tenantName);
  };

  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
      onSubmit={handleCreateTenant}
      className={classes.createTenant}
    >
      <Box className={classes.form}>
        <h2>Create a new account:</h2>
        <TextField
          required
          id="account-name"
          label="Account Name"
          defaultValue=""
          onChange={e => setTenantName(e.target.value)}
        />
        <Button type="submit" className={classes.submitButton}>
          Create
        </Button>
      </Box>
      <Box className={classes.image}>
        <img src={armoImage} height={500} width={500} alt="armo-waiting" />
      </Box>
    </Box>
  );
};

export default CreateTenant;
