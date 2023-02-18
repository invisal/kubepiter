import { TextInputSkeleton, ComboBox } from "@carbon/react";
import useApiNodeGroupList from "../hooks/useApiNodeGroupList";
import useApiRegistryList from "../hooks/useApiRegistryList";

export default function NodeGroupListCombo({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (value: string | undefined) => void;
}) {
  const { data } = useApiNodeGroupList();

  if (!data) return <TextInputSkeleton />;
  if (!data.nodeGroups) return <TextInputSkeleton />;

  const items = data.nodeGroups.map((item) => item?.tag || "");

  return (
    <ComboBox
      spellCheck={false}
      id="node_groups"
      items={items}
      value={value}
      onChange={(e) => {
        if (onChange) {
          onChange(e.selectedItem ? e.selectedItem : undefined);
        }
      }}
      placeholder=""
      titleText="Node Group (optional)"
    />
  );
}
