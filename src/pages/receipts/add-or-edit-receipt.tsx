// AddOrEditReceiptPage.tsx
import { DatePickerInput } from "@/components/shadcn-studio/blocks/date-picker";
import { DropdownLists } from "@/components/shadcn-studio/blocks/dropdown-list";
import { SliderRangeButton } from "@/components/shadcn-studio/blocks/slider-button";
import { Button } from "@/components/ui/button";
import CurrencyInput from "@/components/ui/currency-input";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import FileUpload from "@/components/ui/upload-textarea";
import { UniversalDataService } from "@/lib/currency";
import { CreateReceiptSchema, EditReceiptSchema } from "@/lib/validation";
import { useAlert } from "@/services/alert";
import { api } from "@/services/api";
import { ReceiptCent } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export function AddOrEditReceiptPage() {
  const { receiptId } = useParams();
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const BASE_URL = import.meta.env.VITE_API_URL;
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [isEdit, setIsEdit] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("CREDIT");
  const [otherMethod, setOtherMethod] = useState("");
  const paymentMethodsList = ["CREDIT", "DEBIT", "FPX", "BNPL", "OTHERS"];
  const [isOther, setIsOther] = useState(true);
  const [amount, setAmount] = useState("");
  const [taxAmount, setTaxAmount] = useState("");
  const [receiptDate, setReceiptDate] = useState(new Date());
  const [shopName, setShopName] = useState("");
  const [currList, setCurrList] = useState<any[]>([]);
  const [categoryList, setCategoryLists] = useState<any[]>([]);
  const [currency, setCurrency] = useState("");
  const [category, setCategory] = useState("");
  const [invoice, setInvoice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [descriptions, setDescription] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const currencies = await UniversalDataService.getAllCurrencies();
        setCurrList(currencies as any);
        const categories =
          await UniversalDataService.getAllSpendingCategories();
        setCategoryLists(categories as any);

        if (receiptId) {
          setIsEdit(true);
          const response = await api.getAuth(`/api/receipts/id/${receiptId}`);
          const data = (response as any)?.data || response;
          if (data) {
            setShopName(data.store_name || "");
            setAmount(String(data.total_amount || ""));
            setTaxAmount(String(data.tax_amount || ""));
            setCurrency(data.currency || "");
            setCategory(data.category || "");
            setInvoice(data.invoice_no || "");
            setImageUrl(data.image_ref_url || "");
            setDescription(data.descriptions || "");
            if (data.receipt_date) setReceiptDate(new Date(data.receipt_date));

            if (paymentMethodsList.includes(data.payment_method)) {
              setPaymentMethod(data.payment_method);
              setIsOther(true);
            } else {
              setPaymentMethod("OTHERS");
              setOtherMethod(data.payment_method || "");
              setIsOther(false);
            }
          }
        }
      } catch (err) {
        console.error("Error loading form data:", err);
        showAlert("Failed to retrieve details.", "error");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [receiptId]);

  const onPayMethodChanged = (data: any) => {
    setPaymentMethod(data);
    setIsOther(data !== "OTHERS");
  };

  // Triggered instantly when a file is selected
  const handleUpload = async (file: File) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const token = localStorage.getItem("token");

      if (!token) throw new Error("Authentication token missing.");

      const response = await fetch(`${BASE_URL}/api/receipts/upload`, {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      });
      // const response = await api.postAuth('/api/receipts/upload', formData);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Upload failed");
      }

      const result = await response.json();
      // console.log(result);
      if (result.url) {
        setImageUrl(result.url);
      }

      // If Workers AI extracts structure information, auto-populate the layout
      if (result.ocr) {
        if (result.ocr.store_name)
          setShopName(result.ocr.store_name.toUpperCase());
        if (result.ocr.total_amount) setAmount(String(result.ocr.total_amount));
        if (result.ocr.tax_amount) setTaxAmount(String(result.ocr.tax_amount));
        if (result.ocr.invoice_no)
          setInvoice(result.ocr.invoice_no.toUpperCase());
        if (result.ocr.receipt_date) {
          const dateStr = String(result.ocr.receipt_date).trim();
          if (dateStr.includes("/")) {
            const parts = dateStr.split("/");
            if (parts.length === 3) {
              const day = parts[0].padStart(2, "0");
              const month = parts[1].padStart(2, "0");
              const year = parts[2];

              // Reconstruct to valid standard YYYY-MM-DD format
              const normalizedDate = new Date(`${year}-${month}-${day}`);

              if (!isNaN(normalizedDate.getTime())) {
                setReceiptDate(normalizedDate);
              } else {
                setReceiptDate(new Date()); // Fallback if parsing fails
              }
            }
          } else {
            // If it's already YYYY-MM-DD, parse it natively
            const parsedDate = new Date(dateStr);
            if (!isNaN(parsedDate.getTime())) {
              setReceiptDate(parsedDate);
            } else {
              setReceiptDate(new Date());
            }
          }
        }

        // New values mapped from fine-tuned prompt
        if (result.ocr.category) setCategory(result.ocr.category);
        if (result.ocr.currency) setCurrency(result.ocr.currency);
        if (result.ocr.descriptions) setDescription(result.ocr.descriptions);

        showAlert("Receipt scanned and filled automatically!", "success");
      } else {
        showAlert("File uploaded successfully!", "success");
      }
    } catch (err: any) {
      console.error(err);
      showAlert(err.message || "File upload failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const finalPayMethod =
      paymentMethod === "OTHERS" ? otherMethod : paymentMethod;
    const payload = {
      store_name: shopName,
      total_amount: Number(amount) || 0,
      currency: currency,
      category: category,
      receipt_date: receiptDate.toISOString(),
      payment_method: finalPayMethod,
      invoice_no: invoice,
      image_ref_url: imageUrl, // Uses the state URL generated by immediate upload
      tax_amount: Number(taxAmount) || 0,
      descriptions: descriptions,
      ...(isEdit && { id: Number(receiptId) }),
    };

    const schema = isEdit ? EditReceiptSchema : CreateReceiptSchema;
    const validation = schema.safeParse(payload);

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      const formattedErrors: Record<string, string> = {};
      Object.keys(fieldErrors).forEach((key) => {
        formattedErrors[key] = (fieldErrors as any)[key]?.[0] || "";
      });
      setErrors(formattedErrors);
      setLoading(false);
      return;
    }

    try {
      const dto = validation.data;

      if (isEdit) {
        await api.putAuth("/api/receipts/edit", dto);
        showAlert("Receipt updated successfully", "success");
      } else {
        await api.postAuth("/api/receipts/add", dto);
        showAlert("Receipt added successfully", "success");
      }
      navigate("/dashboard");
    } catch (err) {
      console.error("Submission error:", err);
      showAlert("Failed to save changes", `${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full">
      {/* FULL SCREEN GLOBAL BLUR OVERLAY */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/60 backdrop-blur-md transition-all duration-300">
          <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-card border shadow-xl max-w-xs text-center animate-in fade-in zoom-in-95 duration-200">
            {/* Custom Animated Spinner */}
            <div className="relative flex h-12 w-12 items-center justify-center">
              <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/20 opacity-75"></div>
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-lg tracking-tight">
                Processing Receipt
              </h3>
              <p className="text-xs text-muted-foreground">
                Our AI is uploading your file and parsing the receipt details.
                Please wait...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT BLOCK */}
      <div className="w-full max-w-md mx-auto py-6">
        <div className="border-2 rounded-2xl mb-4 px-4 py-2 text-foreground bg-secondary justify-center flex gap-2">
          <ReceiptCent />
          <h1 className="font-semibold">
            {isEdit ? "Update" : "Add"} Transaction Details
          </h1>
        </div>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            {/* Directly calls handleUpload when a file is dropped or selected */}
            <FileUpload onFileSelect={(file) => file && handleUpload(file)} />

            {imageUrl && (
              <p className="text-xs text-muted-foreground bg-secondary p-2 rounded border truncate">
                Attached: {imageUrl}
              </p>
            )}
            {errors.image_ref_url && (
              <p className="text-destructive text-xs">{errors.image_ref_url}</p>
            )}

            <FieldSet>
              <FieldLegend>Payment Method</FieldLegend>
              {errors.payment_method && (
                <p className="text-destructive text-xs">
                  {errors.payment_method}
                </p>
              )}
              <FieldDescription>Select your payment method</FieldDescription>
              <SliderRangeButton
                options={paymentMethodsList}
                value={paymentMethod}
                onChange={onPayMethodChanged}
                className="max-w-md p-0"
              />
              <Field orientation={"horizontal"}>
                <FieldLabel hidden={isOther}>Other Type</FieldLabel>
                <Input
                  hidden={isOther}
                  placeholder="State other payment type.."
                  value={otherMethod}
                  onChange={(e) => setOtherMethod(e.target.value.toUpperCase())}
                />
              </Field>

              <FieldSeparator />
              <FieldGroup>
                <Field>
                  <FieldLabel>Shop Name</FieldLabel>
                  <Input
                    placeholder="Zus Coffee ..."
                    required
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value.toUpperCase())}
                  />
                  {errors.store_name && (
                    <p className="text-destructive text-xs">
                      {errors.store_name}
                    </p>
                  )}
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field orientation={"vertical"} className="gap-1">
                    <FieldLabel>Total Amount</FieldLabel>
                    <CurrencyInput
                      value={Number(amount)}
                      onChange={(e: any) => setAmount(e)}
                      placeholder="0.00"
                    />
                    {errors.total_amount && (
                      <p className="text-destructive text-xs">
                        {errors.total_amount}
                      </p>
                    )}
                  </Field>

                  <Field orientation={"vertical"} className="gap-1">
                    <FieldLabel>Tax Amount</FieldLabel>
                    <CurrencyInput
                      value={Number(taxAmount)}
                      onChange={(e: any) => setTaxAmount(e)}
                      placeholder="0.00"
                    />
                    {errors.tax_amount && (
                      <p className="text-destructive text-xs">
                        {errors.tax_amount}
                      </p>
                    )}
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <DropdownLists
                    items={categoryList}
                    value={category}
                    onChange={(e) => setCategory(e)}
                    title="Category Type"
                    placeholder="Select Category"
                  />
                  <DropdownLists
                    items={currList}
                    value={currency}
                    onChange={(e) => setCurrency(e)}
                    title="Currency Type"
                    placeholder="Select Currency"
                  />
                </div>

                <Field orientation={"horizontal"} className="gap-2">
                  <DatePickerInput
                    label="Receipt Date"
                    className="max-w-sm"
                    value={receiptDate}
                    onChange={(e) => setReceiptDate(e || new Date())}
                  />
                  <Button
                    variant={"default"}
                    type="button"
                    onClick={() => setReceiptDate(new Date())}
                    className="mt-6 text-primary-foreground flex-1 text-[10px] font-bold uppercase"
                  >
                    Set Today
                  </Button>
                </Field>
              </FieldGroup>
            </FieldSet>

            <FieldSeparator />
            <Field>
              <FieldLabel htmlFor="invoice_no">Invoice No</FieldLabel>
              <Input
                id="invoice_no"
                placeholder="INV-001..."
                required
                value={invoice}
                onChange={(e) => setInvoice(e.target.value.toUpperCase())}
              />
              {errors.invoice_no && (
                <p className="text-destructive text-xs">{errors.invoice_no}</p>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="descriptions">Description</FieldLabel>
              <Textarea
                id="descriptions"
                placeholder="Add any description of the receipt"
                className="resize-none"
                value={descriptions}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Field>

            <Field
              orientation="horizontal"
              className="flex justify-end gap-2 mt-4"
            >
              <Button
                variant="outline"
                type="button"
                onClick={() => navigate("/dashboard")}
              >
                Cancel
              </Button>
              <Button type="submit">{isEdit ? "Update" : "Submit"}</Button>
            </Field>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
}
