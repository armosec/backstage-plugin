import React, { useState, useEffect } from 'react';
import { Button, Grid, makeStyles } from '@material-ui/core';
import { useCopyToClipboard } from 'usehooks-ts';
import { useNavigate } from 'react-router-dom';
import armoImage from "../../Utils/wizard_success.png";

const useStyles = makeStyles({
  helm: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: '20px',
  },
  script: {
    padding: '50px',
    border: '1px solid',
    width: '500px'
  },
  scriptImage: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  }
});
const HelmScript = ({
  customerGUID,
  setIsHelmedCopied,
}: {
  customerGUID: string;
  setIsHelmedCopied: (val: boolean) => void;
}) => {
  const classes = useStyles();
  const [value, copy] = useCopyToClipboard();
  const [helmText] = useState(
    `helm repo add kubescape https://kubescape.github.io/helm-charts/ ; helm repo update ; helm upgrade --install kubescape kubescape/kubescape-cloud-operator -n kubescape --create-namespace --set clusterName="kubectl config current-context" --set account=${customerGUID}`,
  );
  const navigate = useNavigate()

  useEffect(() => {
    if(value){
      setIsHelmedCopied(false)
    }
  }, [value])
  return (
    <Grid className={classes.helm}>
      <h2>Connect your Kubernetes cluster</h2>
      <Grid className={classes.scriptImage}>
        <Grid>
          <Grid className={classes.script}>{helmText}</Grid>
          <Button onClick={() => copy(helmText)} >Copy</Button>
          {value ?<Button onClick={() => navigate('/compliance')}>I ran the script</Button> : null}
        </Grid>
        <Grid>
          <img
              src={armoImage}
              height={500}
              width={500}
              alt="armo-waiting"
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default HelmScript;
