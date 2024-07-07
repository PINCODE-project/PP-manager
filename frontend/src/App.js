import {BrowserRouter} from "react-router-dom";
import {MantineProvider} from "@mantine/core";
import {RootRouter} from "./routes/RootRouter";
import {Provider} from "react-redux";
import {App, ConfigProvider, theme} from "antd";
import {store} from "./store";
import '@mantine/core/styles.css';
import '@mantine/spotlight/styles.css';
import '@mantine/nprogress/styles.css';
import '@mantine/charts/styles.css';
import './App.css';
import './themes/variables.css'


export default function MyApp() {
    return (
        <div className="App">
            <Provider store={store}>
                <ConfigProvider>
                    <App>
                        <MantineProvider>
                            <BrowserRouter>
                                <RootRouter/>
                            </BrowserRouter>
                        </MantineProvider>
                    </App>
                </ConfigProvider>
            </Provider>
        </div>
    );
}
