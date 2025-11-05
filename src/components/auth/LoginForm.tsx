import { useState, useCallback, type FormEvent } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { toast } from "sonner";

interface LoginFormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export function LoginForm() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Set<keyof LoginFormData>>(new Set());

  // Validate individual field
  const validateField = useCallback((field: keyof LoginFormData, value: string): string | undefined => {
    switch (field) {
      case "email":
        if (!value.trim()) {
          return "Email is required";
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return "Invalid email format";
        }
        return undefined;
      case "password":
        if (!value) {
          return "Password is required";
        }
        if (value.length < 6) {
          return "Password must be at least 6 characters";
        }
        return undefined;
      default:
        return undefined;
    }
  }, []);

  // Validate all fields
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    
    const emailError = validateField("email", formData.email);
    if (emailError) newErrors.email = emailError;
    
    const passwordError = validateField("password", formData.password);
    if (passwordError) newErrors.password = passwordError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validateField]);

  // Handle input change
  const handleChange = useCallback((field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Clear general error when user types
    if (errors.general) {
      setErrors((prev) => ({ ...prev, general: undefined }));
    }
    
    // Validate on change if field was previously touched
    if (touchedFields.has(field)) {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  }, [errors.general, touchedFields, validateField]);

  // Handle field blur
  const handleBlur = useCallback((field: keyof LoginFormData) => {
    setTouchedFields((prev) => new Set(prev).add(field));
    const error = validateField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: error }));
  }, [formData, validateField]);

  // Handle form submission
  const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouchedFields(new Set(["email", "password"]));
    
    // Validate form
    if (!validateForm()) {
      // Focus first invalid field
      const firstError = errors.email ? "email" : errors.password ? "password" : null;
      if (firstError) {
        const element = document.getElementById(firstError);
        element?.focus();
      }
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      // TODO: This will be implemented in the backend phase
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const data = await response.json();
        
        if (response.status === 400) {
          setErrors({ general: "Invalid email or password format" });
        } else if (response.status === 401) {
          setErrors({ general: "Invalid credentials. Please try again." });
        } else if (response.status === 429) {
          setErrors({ general: "Too many login attempts. Please try again later." });
        } else {
          setErrors({ general: "An unexpected error occurred. Please try again later." });
        }
        return;
      }
      
      // Success - redirect to projects
      toast.success("Login successful!");
      window.location.href = "/projects";
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ 
        general: "Unable to connect. Please check your internet connection." 
      });
    } finally {
      setIsLoading(false);
    }
  }, [formData, validateForm, errors]);

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
        <CardDescription>
          Enter your credentials to access your vacation plans
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {/* General error message */}
          {errors.general && (
            <div 
              className="p-3 bg-destructive/10 border border-destructive rounded-md"
              role="alert"
              aria-live="polite"
            >
              <p className="text-sm text-destructive">{errors.general}</p>
            </div>
          )}
          
          {/* Email field */}
          <div className="space-y-2">
            <Label htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              disabled={isLoading}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && (
              <p 
                id="email-error" 
                className="text-sm text-destructive"
                role="alert"
              >
                {errors.email}
              </p>
            )}
          </div>
          
          {/* Password field */}
          <div className="space-y-2">
            <Label htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              onBlur={() => handleBlur("password")}
              disabled={isLoading}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              className={errors.password ? "border-destructive" : ""}
            />
            {errors.password && (
              <p 
                id="password-error" 
                className="text-sm text-destructive"
                role="alert"
              >
                {errors.password}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? "Logging in..." : "Log In"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

