import { useContext, useState, useEffect, createContext } from 'react';
import * as roleAPI from '../utilities/role-api';

// create a context for authentication
const RoleContext = createContext({
    roles: null,
});

export const RoleProvider = ({ children }) => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getRoles();
    }, []);

    async function getRoles() {
        const { roles, error } = await roleAPI.getRoles();
        if (error) {
            console.error(error);
            return;
        }
        setRoles(roles);
        setLoading(false);
    }

    const value = {
        roles,
    };

    // use a provider to pass down the value
    return (
        <RoleContext.Provider value={value}>
            {!loading && children}
        </RoleContext.Provider>
    );
};

// export the useAuth hook
export const useRoles = () => {
    return useContext(RoleContext);
};
