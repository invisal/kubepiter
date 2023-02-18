declare module "@carbon/react" {
  export * from "carbon-components-react";

  interface TabListProps {
    activation?: "automatic" | "manual";
    contained?: boolean;
  }
  export const TabList: React.FC<PropsWithChildren<TabListProps>>;

  interface TabPanelsProps {}
  export const TabPanels: React.FC<TabPanelsProps>;

  interface TabPanelProps {}
  export const TabPanel: React.FC<TabPanelProps>;

  interface TabsProps {
    selectedIndex?: number;
  }
  export const Tabs: React.FC<PropsWithChildren<TabsProps>>;

  interface FlexGridProps {}
  export const FlexGrid: React.FC<FlexGridProps>;

  interface ProgressBarProps {
    status?: "active" | "finished" | "error";
    value?: number;
    label?: string;
  }
  export const ProgressBar: React.FC<ProgressBarProps>;

  interface ActionableNotificationProps {
    title?: string;
    inline?: boolean;
    actionButtonLabel?: string;
  }
  export const ActionableNotification: React.FC<ActionableNotificationProps>;
}
