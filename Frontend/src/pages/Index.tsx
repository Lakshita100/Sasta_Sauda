import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import RoleSelection from './RoleSelection';

const Index = () => {
  const navigate = useNavigate();
  const { userRole } = useApp();

  useEffect(() => {
    // If user already has a role, redirect to market
    if (userRole) {
      navigate('/market');
    }
  }, [userRole, navigate]);

  return <RoleSelection />;
};

export default Index;
