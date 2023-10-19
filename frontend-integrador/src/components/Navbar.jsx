import React from 'react';

const Navbar = () => {
  return (
    <header
      style={{
        width: '100%',
        position: 'fixed',
        top: 0,
        backgroundColor: '#333',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px', 
        zIndex: 1000, 
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <a
          href="/" 
          style={{
            textDecoration: 'none',
            color: 'white',
            marginRight: '20px', 
          }}
        >
          <img
            src="/HOME" 
            alt="Logo"
            style={{
              height: '30px', 
            }}
          />
        </a>
        <span
          style={{
            color: 'white',
          }}
        >
          Lema de la Empresa
        </span>
      </div>
      <div>
        <button
          style={{
            marginRight: '10px',
          }}
        >
          Crear cuenta
        </button>
        <button>Iniciar sesión</button>
      </div>
    </header>
  );
};

export default Navbar;