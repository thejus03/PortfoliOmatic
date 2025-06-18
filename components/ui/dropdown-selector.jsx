import React from 'react'
import { 
    Portal,
    Select
} from "@chakra-ui/react"

const DropdownSelector = ({size, collection, func, label, placeholder, value}) => {
  return (
    <Select.Root
    collection={collection}
    size={size}
    value={value}
    onValueChange = {(e) => func(e.value)}
    >
        <Select.HiddenSelect />
        <Select.Label>{label}</Select.Label>
        <Select.Control>
            <Select.Trigger>
            <Select.ValueText placeholder={placeholder} />
            </Select.Trigger>
            <Select.IndicatorGroup>
            <Select.Indicator />
            </Select.IndicatorGroup>
        </Select.Control>
        <Portal>
            <Select.Positioner>
            <Select.Content>
                {collection.items.map((elem) => (
                <Select.Item item={elem} key={elem.value}>
                    {elem.label}
                    <Select.ItemIndicator />
                </Select.Item>
                ))}
            </Select.Content>
            </Select.Positioner>
        </Portal>
    </Select.Root>
  )
}

export default DropdownSelector