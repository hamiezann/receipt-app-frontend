import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
interface DropdownItem {
  id: string;
  name: string;
}

interface DropdownListProps {
  items: DropdownItem[];
  value?: string; // The ID of the selected item
  onChange: (id: string) => void;
  title?: string;
  placeholder?: string;
}

export function DropdownLists({
  items,
  value,
  onChange,
  title = "Options",
  placeholder = "Select item",
}: DropdownListProps) {
  // Find the name of the currently selected item to show on the button
  const selectedItem = items.find((item) => item.id === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {selectedItem ? selectedItem.name : placeholder}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{title}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {items.map((item) => (
            <DropdownMenuItem key={item.id} onSelect={() => onChange(item.id)}>
              {item.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
