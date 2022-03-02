import React, {PropsWithChildren} from "react";
import { Route, RouteProps} from "react-router-dom";

interface IPrivateRouteProps extends RouteProps {
    isLoggedIn: boolean;
}

function PrivateRoute({isLoggedIn, children, ...rest}: PropsWithChildren<IPrivateRouteProps>) {
    return (
        <Route
            {...rest}
            // render={({location}:any) =>
            //     isLoggedIn ? (
            //         children
            //     ) : (
            //         /* istanbul ignore next */
            //         <Redirect
            //             to={{
            //                 pathname: '/signin',
            //                 state: {from: location},
            //             }}
            //         />
            //     )
            // }
        />
    )
}

export default PrivateRoute
