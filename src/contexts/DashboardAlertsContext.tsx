import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { DASHBOARD_ALERTS_SEED } from '@/lib/dashboardAlertsSeed';
import type {
  DashboardAlertsState,
  IdleMachineryAlert,
  LoiteringAlert,
  PpeAlert,
  PhoneAlert,
  SecurityAlert,
  SleepAlert,
} from '@/types/dashboardAlerts';

type DashboardAlertsContextValue = {
  alerts: DashboardAlertsState;
  setOperationsIdle: (items: IdleMachineryAlert[]) => void;
  setOperationsLoitering: (items: LoiteringAlert[]) => void;
  setCompliancePpe: (items: PpeAlert[]) => void;
  setCompliancePhone: (items: PhoneAlert[]) => void;
  setComplianceSleep: (items: SleepAlert[]) => void;
  setSecurityPerimeter: (items: SecurityAlert[]) => void;
  setSecurityRestricted: (items: SecurityAlert[]) => void;
  setSecurityFireSmoke: (items: SecurityAlert[]) => void;
  removeAlert: (
    domain: 'operations' | 'compliance' | 'security',
    category: string,
    id: string
  ) => void;
};

const DashboardAlertsContext = createContext<DashboardAlertsContextValue | null>(
  null
);

export function DashboardAlertsProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<DashboardAlertsState>(DASHBOARD_ALERTS_SEED);

  const setOperationsIdle = useCallback((items: IdleMachineryAlert[]) => {
    setAlerts((prev) => ({
      ...prev,
      operations: { ...prev.operations, idleMachinery: items },
    }));
  }, []);

  const setOperationsLoitering = useCallback((items: LoiteringAlert[]) => {
    setAlerts((prev) => ({
      ...prev,
      operations: { ...prev.operations, loitering: items },
    }));
  }, []);

  const setCompliancePpe = useCallback((items: PpeAlert[]) => {
    setAlerts((prev) => ({
      ...prev,
      compliance: { ...prev.compliance, ppe: items },
    }));
  }, []);

  const setCompliancePhone = useCallback((items: PhoneAlert[]) => {
    setAlerts((prev) => ({
      ...prev,
      compliance: { ...prev.compliance, phone: items },
    }));
  }, []);

  const setComplianceSleep = useCallback((items: SleepAlert[]) => {
    setAlerts((prev) => ({
      ...prev,
      compliance: { ...prev.compliance, sleep: items },
    }));
  }, []);

  const setSecurityPerimeter = useCallback((items: SecurityAlert[]) => {
    setAlerts((prev) => ({
      ...prev,
      security: { ...prev.security, perimeter: items },
    }));
  }, []);

  const setSecurityRestricted = useCallback((items: SecurityAlert[]) => {
    setAlerts((prev) => ({
      ...prev,
      security: { ...prev.security, restricted: items },
    }));
  }, []);

  const setSecurityFireSmoke = useCallback((items: SecurityAlert[]) => {
    setAlerts((prev) => ({
      ...prev,
      security: { ...prev.security, fireSmoke: items },
    }));
  }, []);

  const removeAlert = useCallback(
    (domain: 'operations' | 'compliance' | 'security', category: string, id: string) => {
      setAlerts((prev) => {
        if (domain === 'operations') {
          if (category === 'idleMachinery') {
            return {
              ...prev,
              operations: {
                ...prev.operations,
                idleMachinery: prev.operations.idleMachinery.filter((a) => a._id !== id),
              },
            };
          }
          if (category === 'loitering') {
            return {
              ...prev,
              operations: {
                ...prev.operations,
                loitering: prev.operations.loitering.filter((a) => a._id !== id),
              },
            };
          }
        }
        if (domain === 'compliance') {
          if (category === 'ppe') {
            return {
              ...prev,
              compliance: {
                ...prev.compliance,
                ppe: prev.compliance.ppe.filter((a) => a._id !== id),
              },
            };
          }
          if (category === 'phone') {
            return {
              ...prev,
              compliance: {
                ...prev.compliance,
                phone: prev.compliance.phone.filter((a) => a._id !== id),
              },
            };
          }
          if (category === 'sleep') {
            return {
              ...prev,
              compliance: {
                ...prev.compliance,
                sleep: prev.compliance.sleep.filter((a) => a._id !== id),
              },
            };
          }
        }
        if (domain === 'security') {
          if (category === 'perimeter') {
            return {
              ...prev,
              security: {
                ...prev.security,
                perimeter: prev.security.perimeter.filter((a) => a._id !== id),
              },
            };
          }
          if (category === 'restricted') {
            return {
              ...prev,
              security: {
                ...prev.security,
                restricted: prev.security.restricted.filter((a) => a._id !== id),
              },
            };
          }
          if (category === 'fireSmoke') {
            return {
              ...prev,
              security: {
                ...prev.security,
                fireSmoke: prev.security.fireSmoke.filter((a) => a._id !== id),
              },
            };
          }
        }
        return prev;
      });
    },
    []
  );

  const value = useMemo(
    () => ({
      alerts,
      setOperationsIdle,
      setOperationsLoitering,
      setCompliancePpe,
      setCompliancePhone,
      setComplianceSleep,
      setSecurityPerimeter,
      setSecurityRestricted,
      setSecurityFireSmoke,
      removeAlert,
    }),
    [
      alerts,
      setOperationsIdle,
      setOperationsLoitering,
      setCompliancePpe,
      setCompliancePhone,
      setComplianceSleep,
      setSecurityPerimeter,
      setSecurityRestricted,
      setSecurityFireSmoke,
      removeAlert,
    ]
  );

  return (
    <DashboardAlertsContext.Provider value={value}>
      {children}
    </DashboardAlertsContext.Provider>
  );
}

export function useDashboardAlerts() {
  const ctx = useContext(DashboardAlertsContext);
  if (!ctx) {
    throw new Error('useDashboardAlerts must be used within DashboardAlertsProvider');
  }
  return ctx;
}
