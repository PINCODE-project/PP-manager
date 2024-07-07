import React from 'react';
import {Outlet} from 'react-router-dom';
import {MantineProvider} from '@mantine/core';
import styles from "./LandingLayout.module.css"

export default function LandingLayout() {
    return (
        <div>
            <MantineProvider theme={{colorScheme: 'dark'}}>
                <div className={styles.landingLayout}>
                    <div className={styles.landingLayout__app}>
                        <Outlet/>
                    </div>
                </div>
            </MantineProvider>
        </div>
    );
};
