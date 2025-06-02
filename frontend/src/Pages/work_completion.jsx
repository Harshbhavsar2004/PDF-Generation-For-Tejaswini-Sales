"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { generatePDF } from "@/lib/pdf-generator"
import { Search, Trash2, FileText, Download, Eye, List } from "lucide-react"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

const API_URL = 'http://localhost:5000/api';

export default function WorkCompletionForm() {
  const [formData, setFormData] = useState({
    consumerName: "",
    consumerAddress: "",
    consumerMobile: "",
    systemCapacity: "",
    bankName: "SBI Bank",
    bankBranch: "Pramodnagar Branch",
    bankLocation: "Dhule",
    installerName: "JANHAVI ENTERPRISES DHULE",
    installerAddress: "",
    installerContact: ""
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [savedForms, setSavedForms] = useState([]);
  const [selectedFormId, setSelectedFormId] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    fetchSavedForms();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.consumerName.trim()) newErrors.consumerName = "Consumer name is required";
    if (!formData.consumerAddress.trim()) newErrors.consumerAddress = "Consumer address is required";
    if (!formData.consumerMobile.trim()) newErrors.consumerMobile = "Mobile number is required";
    if (!formData.systemCapacity.trim()) newErrors.systemCapacity = "System capacity is required";
    if (!formData.installerAddress.trim()) newErrors.installerAddress = "Installer address is required";
    if (!formData.installerContact.trim()) newErrors.installerContact = "Installer contact is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchSavedForms = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/work-completion`);
      const data = await response.json();
      setSavedForms(data);
    } catch (error) {
      console.error('Error fetching forms:', error);
      setSubmitError('Failed to fetch forms');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    
    if (!validateForm()) {
      setSubmitError("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/work-completion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save form');
      }

      const data = await response.json();
      await fetchSavedForms();
      setSelectedFormId(data._id);
      setSubmitError("");
      // Clear form after successful submission
      setFormData({
        consumerName: "",
        consumerAddress: "",
        consumerMobile: "",
        systemCapacity: "",
        bankName: "SBI Bank",
        bankBranch: "Pramodnagar Branch",
        bankLocation: "Dhule",
        installerName: "JANHAVI ENTERPRISES DHULE",
        installerAddress: "",
        installerContact: ""
      });
    } catch (error) {
      console.error('Error saving form:', error);
      setSubmitError(error.message || 'Failed to save form');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (formId) => {
    if (!window.confirm('Are you sure you want to delete this form?')) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/work-completion/${formId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete form');
      }

      await fetchSavedForms();
      if (selectedFormId === formId) {
        setSelectedFormId(null);
        setFormData({
          consumerName: "",
          consumerAddress: "",
          consumerMobile: "",
          systemCapacity: "",
          bankName: "SBI Bank",
          bankBranch: "Pramodnagar Branch",
          bankLocation: "Dhule",
          installerName: "JANHAVI ENTERPRISES DHULE",
          installerAddress: "",
          installerContact: ""
        });
      }
    } catch (error) {
      console.error('Error deleting form:', error);
      setSubmitError('Failed to delete form');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setSubmitError("Please fill in all required fields to preview");
      return;
    }
    try {
      const pdfBlob = await generatePDF(formData, "workCompletion", false);
      const url = URL.createObjectURL(pdfBlob);
      setPreviewUrl(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setSubmitError('Failed to generate PDF preview');
    }
  };

  const handleDownload = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setSubmitError("Please fill in all required fields to download");
      return;
    }
    try {
      await generatePDF(formData, "workCompletion", true);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setSubmitError('Failed to generate PDF');
    }
  };

  const loadForm = async (formId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/work-completion/${formId}`);
      const data = await response.json();
      setFormData(data);
      setSelectedFormId(formId);
      setErrors({});
      setSubmitError("");
    } catch (error) {
      console.error('Error loading form:', error);
      setSubmitError('Failed to load form');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredForms = savedForms.filter(form => 
    form.consumerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    form.consumerMobile.includes(searchQuery)
  );

  return (
    <div className="container mx-auto py-10">
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline" className="mb-4 ml-2">
            <List className="h-4 w-4 mr-2 text-blue-500" />
            Saved Forms
          </Button>
        </DrawerTrigger>
        <DrawerContent className="">
          <div className="mx-auto w-full max-w-sm lg:max-w-md">
            <DrawerHeader>
              <DrawerTitle>Saved Forms</DrawerTitle>
              <DrawerDescription>Total Forms: {savedForms.length}</DrawerDescription>
            </DrawerHeader>
            <div className="p-4 pb-0">
              <div className="relative mb-4">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search by name or mobile..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {isLoading ? (
                  <div className="text-center py-4">Loading...</div>
                ) : filteredForms.length === 0 ? (
                  <div className="text-center text-gray-500 py-4">
                    {searchQuery ? 'No forms found' : 'No forms saved yet'}
                  </div>
                ) : (
                  filteredForms.map((form) => (
                    <div
                      key={form._id}
                      className={`p-3 rounded-lg border ${
                        selectedFormId === form._id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => {
                            loadForm(form._id);
                            setIsDrawerOpen(false);
                          }}
                        >
                          <div className="font-medium">{form.consumerName}</div>
                          <div className="text-sm text-gray-500">{form.consumerMobile}</div>
                          <div className="text-xs text-gray-400 mt-1">
                            {new Date(form.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(form._id)}
                            title="Delete"
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Card */}
        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle>Work Completion Report Generator</CardTitle>
            <CardDescription>
              {selectedFormId ? 'Edit existing form' : 'Create new form'}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {submitError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {submitError}
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="consumerName">Consumer Name *</Label>
                  <Input
                    id="consumerName"
                    name="consumerName"
                    value={formData.consumerName}
                    onChange={handleChange}
                    placeholder="e.g. John Doe"
                    className={errors.consumerName ? "border-red-500" : ""}
                  />
                  {errors.consumerName && (
                    <p className="text-red-500 text-sm mt-1">{errors.consumerName}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="consumerMobile">Mobile Number *</Label>
                  <Input
                    id="consumerMobile"
                    name="consumerMobile"
                    value={formData.consumerMobile}
                    onChange={handleChange}
                    placeholder="e.g. 9876543210"
                    className={errors.consumerMobile ? "border-red-500" : ""}
                  />
                  {errors.consumerMobile && (
                    <p className="text-red-500 text-sm mt-1">{errors.consumerMobile}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="consumerAddress">Installation Address *</Label>
                  <Textarea
                    id="consumerAddress"
                    name="consumerAddress"
                    value={formData.consumerAddress}
                    onChange={handleChange}
                    placeholder="Enter complete address"
                    className={errors.consumerAddress ? "border-red-500" : ""}
                  />
                  {errors.consumerAddress && (
                    <p className="text-red-500 text-sm mt-1">{errors.consumerAddress}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="systemCapacity">System Capacity (KW) *</Label>
                  <Input
                    id="systemCapacity"
                    name="systemCapacity"
                    type="number"
                    value={formData.systemCapacity}
                    onChange={handleChange}
                    placeholder="e.g. 3"
                    className={errors.systemCapacity ? "border-red-500" : ""}
                  />
                  {errors.systemCapacity && (
                    <p className="text-red-500 text-sm mt-1">{errors.systemCapacity}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    placeholder="e.g. SBI Bank"
                  />
                </div>

                <div>
                  <Label htmlFor="bankBranch">Bank Branch</Label>
                  <Input
                    id="bankBranch"
                    name="bankBranch"
                    value={formData.bankBranch}
                    onChange={handleChange}
                    placeholder="e.g. Pramodnagar Branch"
                  />
                </div>

                <div>
                  <Label htmlFor="bankLocation">Bank Location</Label>
                  <Input
                    id="bankLocation"
                    name="bankLocation"
                    value={formData.bankLocation}
                    onChange={handleChange}
                    placeholder="e.g. Dhule"
                  />
                </div>

                <div>
                  <Label htmlFor="installerName">Installer Name</Label>
                  <Input
                    id="installerName"
                    name="installerName"
                    value={formData.installerName}
                    onChange={handleChange}
                    placeholder="e.g. JANHAVI ENTERPRISES DHULE"
                  />
                </div>

                <div>
                  <Label htmlFor="installerAddress">Installer Address *</Label>
                  <Textarea
                    id="installerAddress"
                    name="installerAddress"
                    value={formData.installerAddress}
                    onChange={handleChange}
                    placeholder="Enter installer address"
                    className={errors.installerAddress ? "border-red-500" : ""}
                  />
                  {errors.installerAddress && (
                    <p className="text-red-500 text-sm mt-1">{errors.installerAddress}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="installerContact">Installer Contact *</Label>
                  <Input
                    id="installerContact"
                    name="installerContact"
                    value={formData.installerContact}
                    onChange={handleChange}
                    placeholder="Enter installer contact"
                    className={errors.installerContact ? "border-red-500" : ""}
                  />
                  {errors.installerContact && (
                    <p className="text-red-500 text-sm mt-1">{errors.installerContact}</p>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                {selectedFormId ? 'Update Form' : 'Save Form'}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Preview Card */}
        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle>Document Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={handlePreview} disabled={isLoading}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button onClick={handleDownload} disabled={isLoading}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>

            <div className="h-[600px] border rounded-md p-2">
              {previewUrl ? (
                <object
                  data={previewUrl}
                  type="application/pdf"
                  className="w-full h-full"
                >
                  <p>Unable to display PDF preview.</p>
                </object>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Click "Preview" to see the document here
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

