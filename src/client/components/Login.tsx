import React from 'react';

import { 
  Button, 
  Card,
  CardContent,
  Typography } from '../utils/material';

function Login() {
  return (
    <div>
      <Card className="login" sx={{ maxWidth: 345 }}>
        <CardContent>
          <Typography variant='h2'>Login to Gallivant</Typography>
          <Button variant='contained' id='login'>
             <a className='button google' href='/auth/google'>
            Sign in with Google
             </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;
