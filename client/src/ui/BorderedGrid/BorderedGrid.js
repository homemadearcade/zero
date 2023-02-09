import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';

export default function BorderedGrid({maxItems, items, size, width, height}) {
  if(!maxItems) maxItems = items.length
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
        {[...Array(maxItems)].map((_, index) => {
          const style = {width: width || size, height: height || size}
          return <Grid key={index} sx={{p: 0}}>
            <div style={style}>
              {items[index] ? React.cloneElement(items[index], {width, height}) : null}
            </div>
          </Grid>
        })}
      </Grid>
    </Box>
  )
}