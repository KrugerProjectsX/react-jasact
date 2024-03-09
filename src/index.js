import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {createTheme, StyledEngineProvider, ThemeProvider} from "@mui/material";
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
const theme = createTheme({
    components: {
        MuiPopover: {
            defaultProps: {
                container: root,
            },
        },
        MuiPopper: {
            defaultProps: {
                container: root,
            },
        },
        MuiDialog: {
            defaultProps: {
                container: root,
            },
        },
        MuiModal: {
            defaultProps: {
                container: root,
            },
        },
    },
});

root.render(
    <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <React.StrictMode>
            <BrowserRouter>
                <App />
            </BrowserRouter>
          </React.StrictMode>
        </ThemeProvider>
    </StyledEngineProvider>
);
reportWebVitals();