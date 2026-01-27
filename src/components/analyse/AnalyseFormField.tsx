// Wiederverwendbare Formularfelder für die Analyse

import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface BaseFieldProps {
  label: string;
  name: string;
  hint?: string;
  required?: boolean;
  className?: string;
}

interface TextFieldProps extends BaseFieldProps {
  type: 'text' | 'number' | 'email' | 'url';
  value: string | number | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
}

interface TextareaFieldProps extends BaseFieldProps {
  type: 'textarea';
  value: string | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

interface SelectFieldProps extends BaseFieldProps {
  type: 'select';
  value: string | undefined;
  onChange: (value: string) => void;
  options: readonly string[];
  placeholder?: string;
}

interface CheckboxFieldProps extends BaseFieldProps {
  type: 'checkbox';
  value: boolean | undefined;
  onChange: (value: boolean) => void;
}

interface MultiSelectFieldProps extends BaseFieldProps {
  type: 'multiselect';
  value: string[] | undefined;
  onChange: (value: string[]) => void;
  options: readonly string[];
}

type FieldProps = TextFieldProps | TextareaFieldProps | SelectFieldProps | CheckboxFieldProps | MultiSelectFieldProps;

export const AnalyseFormField: React.FC<FieldProps> = (props) => {
  const { label, name, hint, required, className } = props;

  const renderLabel = () => (
    <Label htmlFor={name} className="text-sm font-semibold text-foreground mb-2 block">
      {label}
      {required && <span className="text-destructive ml-1">*</span>}
    </Label>
  );

  const renderHint = () => hint && (
    <p className="text-xs text-muted-foreground mt-1">{hint}</p>
  );

  if (props.type === 'checkbox') {
    return (
      <div className={cn("flex items-start space-x-3", className)}>
        <Checkbox
          id={name}
          checked={props.value ?? false}
          onCheckedChange={props.onChange}
          className="mt-1"
        />
        <div className="flex-1">
          <Label htmlFor={name} className="text-sm font-medium text-foreground cursor-pointer">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
          {renderHint()}
        </div>
      </div>
    );
  }

  if (props.type === 'multiselect') {
    return (
      <div className={className}>
        {renderLabel()}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
          {props.options.map(option => {
            const isChecked = props.value?.includes(option) ?? false;
            return (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`${name}-${option}`}
                  checked={isChecked}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      props.onChange([...(props.value ?? []), option]);
                    } else {
                      props.onChange((props.value ?? []).filter(v => v !== option));
                    }
                  }}
                />
                <Label 
                  htmlFor={`${name}-${option}`} 
                  className="text-sm text-foreground cursor-pointer"
                >
                  {option}
                </Label>
              </div>
            );
          })}
        </div>
        {renderHint()}
      </div>
    );
  }

  if (props.type === 'select') {
    return (
      <div className={className}>
        {renderLabel()}
        <Select value={props.value ?? ''} onValueChange={props.onChange}>
          <SelectTrigger id={name} className="w-full">
            <SelectValue placeholder={props.placeholder ?? 'Bitte wählen'} />
          </SelectTrigger>
          <SelectContent>
            {props.options.map(option => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {renderHint()}
      </div>
    );
  }

  if (props.type === 'textarea') {
    return (
      <div className={className}>
        {renderLabel()}
        <Textarea
          id={name}
          value={props.value ?? ''}
          onChange={(e) => props.onChange(e.target.value)}
          placeholder={props.placeholder}
          rows={props.rows ?? 4}
          className="w-full"
        />
        {renderHint()}
      </div>
    );
  }

  // Text, number, email, url
  return (
    <div className={className}>
      {renderLabel()}
      <Input
        id={name}
        type={props.type}
        value={props.value ?? ''}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder}
        className="w-full"
      />
      {renderHint()}
    </div>
  );
};

export default AnalyseFormField;
