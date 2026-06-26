-- ============================================================
--  BillEase — GST Invoice Generator
--  Database Table Creation Script
--  
--  Instructions:
--  1. pgAdmin mein "billease" database select karo
--  2. Top menu: Tools → Query Tool
--  3. Ye poora code paste karo
--  4. F5 ya "Execute" button dabao
-- ============================================================

-- Company Profile Table (sirf ek row hogi)
CREATE TABLE IF NOT EXISTS company (
    id                  SERIAL PRIMARY KEY,
    name                TEXT NOT NULL,
    address             TEXT NOT NULL,
    gstin               TEXT,
    state_name          TEXT,
    state_code          TEXT,
    email               TEXT NOT NULL DEFAULT '',
    phone               TEXT,
    bank_name           TEXT,
    account_number      TEXT,
    ifsc_code           TEXT,
    branch_name         TEXT,
    logo_url            TEXT,
    declaration_text    TEXT,
    authorized_signatory TEXT,
    invoice_prefix      TEXT DEFAULT 'INV',
    invoice_counter     INTEGER DEFAULT 1,
    watermark_text      TEXT,
    watermark_font      TEXT,
    watermark_opacity   TEXT,
    watermark_color     TEXT,
    watermark_size      TEXT,
    smtp_host           TEXT,
    smtp_port           TEXT,
    smtp_user           TEXT,
    smtp_pass           TEXT,
    smtp_from_name      TEXT,
    smtp_secure         TEXT,
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id          SERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    address     TEXT NOT NULL,
    gstin       TEXT,
    state_name  TEXT,
    state_code  TEXT,
    email       TEXT,
    phone       TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Products / Services Table
CREATE TABLE IF NOT EXISTS products (
    id          SERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    code        TEXT,
    hsn_sac     TEXT,
    unit        TEXT NOT NULL DEFAULT 'PCS',
    rate        DOUBLE PRECISION NOT NULL DEFAULT 0,
    tax_percent DOUBLE PRECISION NOT NULL DEFAULT 18,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices Table
CREATE TABLE IF NOT EXISTS invoices (
    id                  SERIAL PRIMARY KEY,
    invoice_number      TEXT NOT NULL UNIQUE,
    invoice_date        TEXT NOT NULL,
    e_way_bill_number   TEXT,
    delivery_note       TEXT,
    payment_terms       TEXT,
    supplier_ref        TEXT,
    other_ref           TEXT,
    buyer_order_number  TEXT,
    order_date          TEXT,
    buyer_name          TEXT NOT NULL,
    buyer_address       TEXT NOT NULL,
    buyer_gstin         TEXT,
    buyer_phone         TEXT,
    buyer_state_name    TEXT,
    buyer_state_code    TEXT,
    dispatch_doc_number TEXT,
    delivery_note_date  TEXT,
    dispatched_through  TEXT,
    destination         TEXT,
    terms_of_delivery   TEXT,
    subtotal            DOUBLE PRECISION NOT NULL DEFAULT 0,
    discount_amount     DOUBLE PRECISION NOT NULL DEFAULT 0,
    taxable_value       DOUBLE PRECISION NOT NULL DEFAULT 0,
    cgst_total          DOUBLE PRECISION NOT NULL DEFAULT 0,
    sgst_total          DOUBLE PRECISION NOT NULL DEFAULT 0,
    igst_total          DOUBLE PRECISION NOT NULL DEFAULT 0,
    grand_total         DOUBLE PRECISION NOT NULL DEFAULT 0,
    amount_in_words     TEXT NOT NULL DEFAULT '',
    payment_mode        TEXT NOT NULL DEFAULT 'cash',
    status              TEXT NOT NULL DEFAULT 'draft',
    items               JSONB NOT NULL DEFAULT '[]',
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
--  ✅ Done! 4 tables successfully created:
--     company, customers, products, invoices
-- ============================================================
