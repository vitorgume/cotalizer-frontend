import React from 'react';
import './Loading.css';

interface LoadingProps {
    message?: string;
}

const Loading: React.FC<LoadingProps> = ({ message = 'Carregando...' }) => {
    return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-message">{message}</p>
        </div>
    );
};

export default Loading;