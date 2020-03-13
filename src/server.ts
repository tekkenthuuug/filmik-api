import app from './app';

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('App is running');
});

export default server;
