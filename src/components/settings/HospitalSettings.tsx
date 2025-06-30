
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { getFromLocalStorage, saveToLocalStorage } from '@/services/localStorage';
import { Settings, Building, Upload } from 'lucide-react';

interface HospitalConfiguration {
  name: string;
  logo: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  description: string;
}

const HospitalSettings: React.FC = () => {
  const [config, setConfig] = useState<HospitalConfiguration>({
    name: '',
    logo: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    description: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const savedConfig = getFromLocalStorage('hospitalConfiguration');
      if (savedConfig) {
        setConfig(savedConfig);
      }
    } catch (error) {
      console.error('Error loading hospital configuration:', error);
    }
  }, []);

  const handleInputChange = (field: keyof HospitalConfiguration, value: string) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setConfig(prev => ({
          ...prev,
          logo: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      saveToLocalStorage('hospitalConfiguration', config);
      toast({
        title: "Configuración guardada",
        description: "La configuración del hospital se ha actualizado correctamente"
      });
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast({
        title: "Error",
        description: "Error al guardar la configuración",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setConfig({
      name: '',
      logo: '',
      address: '',
      phone: '',
      email: '',
      website: '',
      description: ''
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-900 flex items-center">
          <Settings className="h-6 w-6 mr-2" />
          Configuración del Hospital
        </h2>
        <p className="text-blue-600">Personaliza la información y apariencia de tu hospital</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-blue-800">
            <Building className="h-5 w-5 mr-2" />
            Información del Hospital
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="hospitalName">Nombre del Hospital</Label>
              <Input
                id="hospitalName"
                value={config.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ej: Hospital General San Juan"
              />
            </div>
            
            <div>
              <Label htmlFor="hospitalPhone">Teléfono</Label>
              <Input
                id="hospitalPhone"
                value={config.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Ej: +1 234 567 8900"
              />
            </div>
            
            <div>
              <Label htmlFor="hospitalEmail">Email</Label>
              <Input
                id="hospitalEmail"
                type="email"
                value={config.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Ej: contacto@hospital.com"
              />
            </div>
            
            <div>
              <Label htmlFor="hospitalWebsite">Sitio Web</Label>
              <Input
                id="hospitalWebsite"
                value={config.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="Ej: www.hospital.com"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="hospitalAddress">Dirección</Label>
            <Input
              id="hospitalAddress"
              value={config.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Ej: Av. Principal 123, Ciudad, País"
            />
          </div>

          <div>
            <Label htmlFor="hospitalDescription">Descripción</Label>
            <Textarea
              id="hospitalDescription"
              value={config.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Descripción breve del hospital..."
              className="min-h-24"
            />
          </div>

          <div>
            <Label htmlFor="hospitalLogo">Logo del Hospital</Label>
            <div className="mt-2 flex items-center space-x-4">
              <input
                id="hospitalLogo"
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('hospitalLogo')?.click()}
                className="flex items-center"
              >
                <Upload className="h-4 w-4 mr-2" />
                Subir Logo
              </Button>
              {config.logo && (
                <div className="flex items-center space-x-2">
                  <img
                    src={config.logo}
                    alt="Logo del hospital"
                    className="h-12 w-12 object-contain border rounded"
                  />
                  <span className="text-sm text-green-600">Logo cargado</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
            >
              Restablecer
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSaving ? 'Guardando...' : 'Guardar Configuración'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HospitalSettings;
