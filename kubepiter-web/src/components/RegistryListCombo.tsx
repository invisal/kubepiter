import { TextInputSkeleton, ComboBox } from "@carbon/react";
import { GqlRegistry } from "src/generated/graphql";
import useApiRegistryList from "../hooks/useApiRegistryList";

export default function RegistryListCombo({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (value: GqlRegistry | null) => void;
}) {
  const { data } = useApiRegistryList();

  if (!data) return <TextInputSkeleton />;
  if (!data.registries) return <TextInputSkeleton />;

  const items = data.registries || [];

  return (
    <ComboBox
      spellCheck={false}
      id="registry_secret"
      items={items}
      value={value}
      itemToString={(item) => item?.name || ""}
      itemToElement={(item) => (
        <div className="flex">
          <div className="mr-2">
            <i className="fa-brands fa-docker" style={{ color: "#2980b9" }} />
          </div>
          <div className="flex-grow">
            <strong>{item.name}</strong>
          </div>
          <div style={{ width: 40, fontSize: "0.8rem" }}>Used: </div>
          <div
            style={{
              textAlign: "right",
              width: 20,
              color: "#e74c3c",
              fontSize: "0.8rem",
            }}
          >
            {item.totalAppUsed}
          </div>
        </div>
      )}
      onChange={(e) => {
        if (onChange) {
          onChange(e.selectedItem ? e.selectedItem : null);
        }
      }}
      placeholder=""
      titleText="Container Registry"
    />
  );
}
