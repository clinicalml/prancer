import React from 'react';

import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import indigo from '@material-ui/core/colors/indigo';
import teal from '@material-ui/core/colors/teal';


/* application components */
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

/* global styles for app */
import './styles/app.scss';

class App extends React.Component { // eslint-disable-line react/prefer-stateless-function
    render() {
        const theme = {
          palette: {
            primary: {
              main: '#607D8B'
            },
            secondary: {
              main: '#E0F2F1'
            }
          },
          typography: {
            fontSize: 24,
          }
        };

        return (
            <MuiThemeProvider theme={createMuiTheme(theme)}>
                <section>
                    <Header />
                    <div
                      className="container"
                      style={{ marginTop: 10, paddingBottom: 20 }}
                    >
                        {this.props.children}
                    </div>
                    <div>
                        <Footer />
                    </div>
                </section>
            </MuiThemeProvider>
        );
    }
}

export { App };
