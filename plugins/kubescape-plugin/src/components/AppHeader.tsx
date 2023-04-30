import React, { ReactNode } from 'react';
import { HeaderLabel, Header } from '@backstage/core-components';
import { Grid } from '@material-ui/core';

const AppHeader = ({
  title,
  subtitle,
  headerLabels,
  children,
}: {
  title: string;
  subtitle?: string;
  headerLabels?: Array<{ label: string; value?: string; id: number }>;
  children?: ReactNode;
}) => {
  return (
    <Header title={title} subtitle={subtitle}>
      <Grid>
        {headerLabels?.map(headerLabel => {
          const { value, label, id } = headerLabel;
          return <HeaderLabel key={id} label={label} value={value} />;
        })}
      </Grid>
      <Grid>{children}</Grid>
    </Header>
  );
};

export default AppHeader;
