import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import LeftNav from '@material-ui/core/Drawer';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';


export class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
        };

    }

    dispatchNewRoute(route) {
        browserHistory.push(route);
        this.setState({
            open: false,
        });

    }


    handleClickOutside() {
        this.setState({
            open: false,
        });
    }


    logout(e) {
        e.preventDefault();
        this.props.logoutAndRedirect();
        this.setState({
            open: false,
        });
    }

    openNav() {
        this.setState({
            open: true,
        });
    }

    render() {
        return (
            <header>
                <LeftNav open={this.state.open}>
                    {
                      <div>
                        <MenuItem onClick={() => this.dispatchNewRoute('/home')}>
                            Home
                        </MenuItem>
                        <MenuItem onClick={() => this.dispatchNewRoute('/filesView')}>
                            Files
                        </MenuItem>
                        <MenuItem onClick={() => this.dispatchNewRoute('/tutorial')}>
                            Tutorial
                        </MenuItem>
                      </div>
                    }
                </LeftNav>
                <AppBar position="static">
                  <Toolbar>
                    <IconButton className="menu-button" color="inherit" aria-label="Menu">
                      <MenuIcon onClick={() => this.openNav()} />
                    </IconButton>
                    <Typography variant="title" color="inherit" className="flex">
                      Clinical Annotation
                    </Typography>
                  </Toolbar>
                </AppBar>
            </header>

        );
    }
}
