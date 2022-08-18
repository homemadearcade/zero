import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';

export default function BorderedGrid({maxItems, items, size, width, height}) {
  return (
    <Box sx={{ p: 1 }}>
      <Grid
        container
        spacing={2}
        sx={{
          '--Grid-borderWidth': '1px',
          borderTop: 'var(--Grid-borderWidth) solid',
          borderLeft: 'var(--Grid-borderWidth) solid',
          borderColor: 'divider',
          
          '& > div': {
            borderRight: 'var(--Grid-borderWidth) solid',
            borderBottom: 'var(--Grid-borderWidth) solid',
            borderColor: 'divider',
          },
        }}
      >
        {[...Array(maxItems)].map((_, index) => (
          <Grid key={index} sx={{p: 0}}>
            <div style={{width: width || size, height: height || size}}>
              {items[index] ? items[index] : null}
            </div>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}