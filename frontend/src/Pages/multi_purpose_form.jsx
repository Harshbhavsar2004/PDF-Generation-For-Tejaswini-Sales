"use client";

import { useState, useEffect, useCallback } from "react";
import SolarForm from "@/components/solar-form";
import { generateDCR } from "@/lib/generate-dcr";
import { generateWCR } from "@/lib/generate-wcr";
import { generateHypothecation } from "@/lib/generate-hypothecation";
import { generateNetMeter } from "@/lib/generate-net-meter";
import { generateModelAgreement } from "@/lib/generate-modelaggrement";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Trash2, Eye, Download, List } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const API_URL = "https://pdf-generation-by-tejaswini-solar-s.vercel.app/api";

const initialFormData = {
  consumerName: "",
  consumerNumber: "",
  mobileNumber: "",
  email: "",
  address: "",
  reArrangementType: "Net Metering Arrangement",
  reSource: "solar",
  sanctionedCapacity: "",
  capacityType: "single phase",
  projectModel: "NA",
  installedCapacityRooftop: "",
  installedCapacityTotal: "NA",
  installedCapacityGround: "NA",
  installationDate: "",
  inverterCapacity: "",
  inverterMake: "",
  numberOfModules: "",
  moduleCapacity: "",
  category: "Private",
  warrantyDetails: "30 Years",
  sanctionNumber: "",
  moduleManufacturer: "",
  moduleWattage: "",
  moduleSerialNumbers: ["", "", "", "", "", ""],
  inverterModel: "",
  inverterRating: "5 star",
  chargeControllerType: "1mppt",
  earthingCount: "3",
  lightningArrester: "Yes",
  manufacturingYear: new Date().getFullYear().toString(),
  aadharNumber: "",
  cellManufacturer: "",
  cellGSTInvoice: "",
  cellGSTDate: "",
  installerName: "",
  installerDesignation: "",
  installerPhone: "",
  installerEmail: "",
  companyName: "",
  msedclOfficerName: "",
  msedclOfficerDesignation: "",
  msedclInspectionDate: "",
  customerSignature: "",
  vendorSignature: "",
  companyStamp: "",
  totalCost: "",
};

export default function Multipurpose() {
  const [formData, setFormData] = useState(initialFormData);
  const [previewUrls, setPreviewUrls] = useState({
    dcr: null,
    wcr: null,
    hypothecation: null,
    netMeter: null,
    modelAgreement: null,
  });
  const [savedForms, setSavedForms] = useState([]);
  const [selectedFormId, setSelectedFormId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchSavedForms = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/multi-purpose`);
      const data = await response.json();
      setSavedForms(data);
    } catch (error) {
      console.error('Error fetching forms:', error);
      setSubmitError('Failed to fetch forms');
    } finally {
      setIsLoading(false);
    }
  };


  const handleFormChange = useCallback((data) => {
    setFormData((prev) => {
      const newData = { ...prev };
      Object.keys(data).forEach(key => {
        newData[key] = data[key] ?? "";
      });
      return newData;
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mounted) return;

    setSubmitError("");
    setIsLoading(true);

    try {
      const requiredFields = [
        'consumerName',
        'consumerNumber',
        'mobileNumber',
        'email',
        'address',
        'sanctionedCapacity',
        'installedCapacityRooftop',
        'installationDate',
        'inverterCapacity',
        'inverterMake',
        'numberOfModules',
        'moduleCapacity',
        'moduleManufacturer',
        'moduleWattage',
        'installerName',
        'installerPhone',
        'companyName',
        'totalCost'
      ];

      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        setSubmitError(`Please fill in all required fields: ${missingFields.join(', ')}`);
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/multi-purpose`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save form");
      }

      const data = await response.json();
      await fetchSavedForms();
      setSelectedFormId(data._id);
      setSubmitError("");
      setFormData(initialFormData);
    } catch (error) {
      console.error("Error saving form:", error);
      setSubmitError(error.message || "Failed to save form");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (formId) => {
    if (!window.confirm("Are you sure you want to delete this form?")) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/multi-purpose/${formId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete form");
      }

      await fetchSavedForms();
      if (selectedFormId === formId) {
        setSelectedFormId(null);
        setFormData(initialFormData);
      }
    } catch (error) {
      console.error("Error deleting form:", error);
      setSubmitError("Failed to delete form");
    } finally {
      setIsLoading(false);
    }
  };

  const loadForm = async (formId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/multi-purpose/${formId}`);
      const data = await response.json();
      setFormData(data);
      setSelectedFormId(formId);
      setSubmitError("");
    } catch (error) {
      console.error("Error loading form:", error);
      setSubmitError("Failed to load form");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreviewDCR = useCallback(async (e) => {
    e.preventDefault();
    if (!mounted) return;

    try {
      const pdfBlob = await generateDCR(formData, false);
      if (pdfBlob) {
        const url = URL.createObjectURL(pdfBlob);
        setPreviewUrls((prev) => ({ ...prev, dcr: url }));
      }
    } catch (error) {
      console.error("Error generating DCR preview:", error);
      setSubmitError("Failed to generate DCR preview");
    }
  }, [formData, mounted]);

  const handlePreviewWCR = useCallback(async (e) => {
    e.preventDefault();
    if (!mounted) return;

    try {
      const pdfBlob = await generateWCR(formData, false);
      if (pdfBlob) {
        const url = URL.createObjectURL(pdfBlob);
        setPreviewUrls((prev) => ({ ...prev, wcr: url }));
      }
    } catch (error) {
      console.error("Error generating WCR preview:", error);
      setSubmitError("Failed to generate WCR preview");
    }
  }, [formData, mounted]);

  const handlePreviewHypothecation = useCallback(async (e) => {
    e.preventDefault();
    if (!mounted) return;

    try {
      const pdfBlob = await generateHypothecation(formData, false);
      if (pdfBlob) {
        const url = URL.createObjectURL(pdfBlob);
        setPreviewUrls((prev) => ({ ...prev, hypothecation: url }));
      }
    } catch (error) {
      console.error("Error generating Hypothecation preview:", error);
      setSubmitError("Failed to generate Hypothecation preview");
    }
  }, [formData, mounted]);

  const handlePreviewNetMeter = useCallback(async (e) => {
    e.preventDefault();
    if (!mounted) return;

    try {
      const netMeterData = {
        consumerName: formData.consumerName || "",
        consumerNumber: formData.consumerNumber || "",
        consumerAddress: formData.address || "",
        agreementDate: new Date(),
        systemCapacity: formData.sanctionedCapacity || "",
        distributionLicensee: "MSEDCL",
        distributionOffice: "Dhule",
        vendorName: formData.companyName || "",
        consumerWitness: formData.installerName || "",
        msedclRepresentative: formData.msedclOfficerName || "",
        msedclWitness: formData.msedclOfficerDesignation || "",
        customerSignature: formData.customerSignature || "",
        vendorSignature: formData.vendorSignature || "",
        companyStamp: formData.companyStamp || "",
      };

      const pdfBlob = await generateNetMeter(netMeterData, false);
      if (pdfBlob) {
        const url = URL.createObjectURL(pdfBlob);
        setPreviewUrls((prev) => ({ ...prev, netMeter: url }));
      }
    } catch (error) {
      console.error("Error generating Net Meter preview:", error);
      setSubmitError("Failed to generate Net Meter preview");
    }
  }, [formData, mounted]);

  const handlePreviewModelAgreement = useCallback(async (e) => {
    e.preventDefault();
    if (!mounted) return;

    try {
      const pdfBlob = await generateModelAgreement(formData, false);
      if (pdfBlob) {
        const url = URL.createObjectURL(pdfBlob);
        setPreviewUrls((prev) => ({ ...prev, modelAgreement: url }));
      }
    } catch (error) {
      console.error("Error generating Model Agreement preview:", error);
      setSubmitError("Failed to generate Model Agreement preview");
    }
  }, [formData, mounted]);

  const handleGenerateDCR = async (e) => {
    e.preventDefault();
    try {
      await generateDCR(formData, true);
    } catch (error) {
      console.error("Error downloading DCR:", error);
      setSubmitError("Failed to download DCR");
    }
  };

  const handleGenerateWCR = async (e) => {
    e.preventDefault();
    try {
      await generateWCR(formData, true);
    } catch (error) {
      console.error("Error downloading WCR:", error);
      setSubmitError("Failed to download WCR");
    }
  };

  const handleGenerateHypothecation = async (e) => {
    e.preventDefault();
    try {
      await generateHypothecation(formData, true);
    } catch (error) {
      console.error("Error downloading Hypothecation:", error);
      setSubmitError("Failed to download Hypothecation");
    }
  };

  const handleGenerateNetMeter = async (e) => {
    e.preventDefault();
    try {
      await generateNetMeter(
        {
          consumerName: formData.consumerName,
          consumerNumber: formData.consumerNumber,
          consumerAddress: formData.address,
          agreementDate: new Date(),
          systemCapacity: formData.sanctionedCapacity,
          distributionLicensee: "MSEDCL",
          distributionOffice: "Dhule",
          vendorName: formData.companyName,
          consumerWitness: formData.installerName,
          msedclRepresentative: formData.msedclOfficerName,
          msedclWitness: formData.msedclOfficerDesignation,
          customerSignature: formData.customerSignature,
          vendorSignature: formData.vendorSignature,
          companyStamp: formData.companyStamp,
        },
        true
      );
    } catch (error) {
      console.error("Error downloading Net Meter:", error);
      setSubmitError("Failed to download Net Meter");
    }
  };

  const handleGenerateModelAgreement = async (e) => {
    e.preventDefault();
    try {
      await generateModelAgreement(formData, true);
    } catch (error) {
      console.error("Error downloading Model Agreement:", error);
      setSubmitError("Failed to download Model Agreement");
    }
  };

  const filteredForms = savedForms.filter(
    (form) =>
      form.consumerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      form.consumerNumber.includes(searchQuery) ||
      form.mobileNumber.includes(searchQuery)
  );

  const getFormStats = () => {
    const totalForms = savedForms.length;
    const formsByMonth = savedForms.reduce((acc, form) => {
      const month = new Date(form.createdAt).toLocaleString("default", {
        month: "short",
      });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    const chartData = Object.entries(formsByMonth).map(([month, count]) => ({
      month,
      count,
    }));

    return { totalForms, chartData };
  };

  const { totalForms, chartData } = getFormStats();

  if (!mounted) {
    return null;
  }

  return (
    <div className="container mx-auto py-10">
      <Button 
        variant="outline" 
        className="mb-4 ml-2" 
        onClick={() => fetchSavedForms()}
      >
        Fetch Saved Forms
      </Button>
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline" className="mb-4 ml-2">
            <List className="h-4 w-4 mr-2 text-blue-500" />
            Saved Forms
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm lg:max-w-md">
            <DrawerHeader>
              <DrawerTitle>Saved Forms</DrawerTitle>
              <DrawerDescription>Page {currentPage} of {totalPages}</DrawerDescription>
            </DrawerHeader>
            <div className="p-4 pb-0">
              <div className="relative mb-4">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search by name, number or mobile..."
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
                    {searchQuery ? "No forms found" : "No forms saved yet"}
                  </div>
                ) : (
                  <>
                    {filteredForms.map((form) => (
                      <div
                        key={form._id}
                        className={`p-3 rounded-lg border ${
                          selectedFormId === form._id
                            ? "border-purple-500 bg-purple-50"
                            : "border-gray-200 hover:border-purple-300"
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
                            <div className="text-sm text-gray-500">
                              {form.consumerNumber}
                            </div>
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
                    ))}
                    {currentPage < totalPages && (
                      <div className="text-center py-4">
                        <Button
                          variant="outline"
                          onClick={loadMoreForms}
                          disabled={isLoadingMore}
                        >
                          {isLoadingMore ? "Loading..." : "Load More"}
                        </Button>
                      </div>
                    )}
                  </>
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
      <div className="mx-2">
        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle>Solar Installation Document Generator</CardTitle>
            <CardDescription>
              {selectedFormId ? "Edit existing form" : "Create new form"}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {submitError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {submitError}
                </div>
              )}
              <SolarForm formData={formData} onChange={handleFormChange} />
            </CardContent>
            <CardFooter className="flex gap-4 mt-2">
              <Button type="submit" disabled={isLoading}>
                {selectedFormId ? "Update Form" : "Save Form"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2  gap-4">
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <button
                onClick={handlePreviewDCR}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Preview Annuxure
              </button>
              <button
                onClick={handleGenerateDCR}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Download Annuxure
              </button>
            </div>
            <div className="h-[500px] border rounded-md p-2">
              {previewUrls.dcr ? (
                <object
                  data={previewUrls.dcr}
                  type="application/pdf"
                  className="w-full h-full"
                >
                  <p>Unable to display PDF preview.</p>
                </object>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Click "Preview Annuxure" to see the document here
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <button
                onClick={handlePreviewWCR}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                Preview WCR
              </button>
              <button
                onClick={handleGenerateWCR}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Download WCR
              </button>
            </div>
            <div className="h-[500px] border rounded-md p-2">
              {previewUrls.wcr ? (
                <object
                  data={previewUrls.wcr}
                  type="application/pdf"
                  className="w-full h-full"
                >
                  <p>Unable to display PDF preview.</p>
                </object>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Click "Preview WCR" to see the document here
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <button
                onClick={handlePreviewHypothecation}
                className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
              >
                Preview DCR
              </button>
              <button
                onClick={handleGenerateHypothecation}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                Download DCR
              </button>
            </div>
            <div className="h-[500px] border rounded-md p-2">
              {previewUrls.hypothecation ? (
                <object
                  data={previewUrls.hypothecation}
                  type="application/pdf"
                  className="w-full h-full"
                >
                  <p>Unable to display PDF preview.</p>
                </object>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Click "Preview DCR" to see the document here
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <button
                onClick={handlePreviewNetMeter}
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
              >
                Preview NetMeter
              </button>
              <button
                onClick={handleGenerateNetMeter}
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
              >
                Download NetMeter
              </button>
            </div>
            <div className="h-[500px] border rounded-md p-2">
              {previewUrls.netMeter ? (
                <object
                  data={previewUrls.netMeter}
                  type="application/pdf"
                  className="w-full h-full"
                >
                  <p>Unable to display PDF preview.</p>
                </object>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Click "Preview Net Meter" to see the document here
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <button
                onClick={handlePreviewModelAgreement}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Preview Model Agreement
              </button>
              <button
                onClick={handleGenerateModelAgreement}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Download Model Agreement
              </button>
            </div>
            <div className="h-[500px] border rounded-md p-2">
              {previewUrls.modelAgreement ? (
                <object
                  data={previewUrls.modelAgreement}
                  type="application/pdf"
                  className="w-full h-full"
                >
                  <p>Unable to display PDF preview.</p>
                </object>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Click "Preview Model Agreement" to see the document here
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
