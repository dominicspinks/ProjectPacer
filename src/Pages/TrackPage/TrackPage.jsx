import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Contexts
import { useAuth } from '../../contexts/AuthProvider';

// Components
import SpinnerIcon from '../../components/SpinnerIcon/SpinnerIcon';

export default function TrackPage({ projectNames }) {
    const { user } = useAuth();

    const [loading, setLoading] = useState(false);
    // setLoading(false); // Placeholder for loading state

    return (
        <>
            {loading ? (
                <SpinnerIcon />
            ) : (
                <>
                    <div className='block p-6  border  rounded-lg shadow bg-gray-800 border-gray-700'>
                        <h5 className='mb-2 text-2xl font-bold tracking-tight mb-4'>
                            Time Tracker
                        </h5>
                    </div>
                    <p>stuff here</p>
                </>
            )}
        </>
    );
}
