import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface BaseFieldProps {
  label: string;
  name: string;
  required?: boolean;
  className?: string;
}

interface TextFieldProps extends BaseFieldProps {
  type: 'text' | 'email' | 'tel' | 'date';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

interface TextareaFieldProps extends BaseFieldProps {
  type: 'textarea';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

interface SelectFieldProps extends BaseFieldProps {
  type: 'select';
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[] | string[];
  placeholder?: string;
}

interface CheckboxGroupProps extends BaseFieldProps {
  type: 'checkbox-group';
  value: string[];
  onChange: (value: string[]) => void;
  options: string[];
}

interface RadioGroupFieldProps extends BaseFieldProps {
  type: 'radio';
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[] | string[];
}

type FormFieldProps = 
  | TextFieldProps 
  | TextareaFieldProps 
  | SelectFieldProps 
  | CheckboxGroupProps 
  | RadioGroupFieldProps;

const FormField = (props: FormFieldProps) => {
  const { label, name, required, className } = props;

  const renderField = () => {
    switch (props.type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'date':
        return (
          <Input
            type={props.type}
            id={name}
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
            placeholder={props.placeholder}
            className="bg-background"
          />
        );

      case 'textarea':
        return (
          <Textarea
            id={name}
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
            placeholder={props.placeholder}
            rows={props.rows || 4}
            className="bg-background resize-none"
          />
        );

      case 'select':
        return (
          <Select value={props.value} onValueChange={props.onChange}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder={props.placeholder || "Bitte wählen..."} />
            </SelectTrigger>
            <SelectContent>
              {props.options.map((option) => {
                const value = typeof option === 'string' ? option : option.value;
                const label = typeof option === 'string' ? option : option.label;
                return (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        );

      case 'checkbox-group':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {props.options.map((option) => (
              <label
                key={option}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                  props.value.includes(option)
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <Checkbox
                  checked={props.value.includes(option)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      props.onChange([...props.value, option]);
                    } else {
                      props.onChange(props.value.filter((v) => v !== option));
                    }
                  }}
                />
                <span className="text-sm">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'radio':
        return (
          <RadioGroup value={props.value} onValueChange={props.onChange} className="space-y-2">
            {props.options.map((option) => {
              const value = typeof option === 'string' ? option : option.value;
              const label = typeof option === 'string' ? option : option.label;
              return (
                <label
                  key={value}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                    props.value === value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <RadioGroupItem value={value} />
                  <span className="text-sm">{label}</span>
                </label>
              );
            })}
          </RadioGroup>
        );
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {renderField()}
    </div>
  );
};

export default FormField;
