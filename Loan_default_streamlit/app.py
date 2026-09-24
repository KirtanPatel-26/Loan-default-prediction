import streamlit as st
import pandas as pd
import joblib
import os

# ----------------------------
# Page Config
# ----------------------------

st.set_page_config(
    page_title="LoanShield AI",
    page_icon="🛡️",
    layout="wide"
)

# ----------------------------
# Custom CSS
# ----------------------------

st.markdown("""
<style>

.main {
    background-color: #F5F5F7;
}

.block-container {
    max-width: 1200px;
    padding-top: 2rem;
}

h1,h2,h3 {
    color: #1D1D1F;
}

.stButton > button {
    width: 100%;
    height: 55px;
    border-radius: 12px;
    font-size: 18px;
    font-weight: 600;
}

[data-testid="stMetric"] {
    background: white;
    padding: 15px;
    border-radius: 16px;
}

[data-testid="stMetric"] label, 
[data-testid="stMetric"] [data-testid="stMetricValue"] {
    color: #1D1D1F !important;
}

</style>
""", unsafe_allow_html=True)

# ----------------------------
# Load Files
# ----------------------------

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
model = joblib.load(os.path.join(CURRENT_DIR, "loan_default_model.pkl"))
feature_columns = joblib.load(os.path.join(CURRENT_DIR, "feature_columns.pkl"))

# ----------------------------
# Header
# ----------------------------

st.title("🛡️ LoanShield AI")
st.subheader("Enterprise Loan Default Risk Assessment Platform")

st.write(
    "Predict financial risk before it happens using Machine Learning."
)

# ----------------------------
# Tabs
# ----------------------------

tab1, tab2, tab3 = st.tabs(
    ["📊 Prediction", "📈 Insights", "ℹ️ About"]
)

# =====================================================
# TAB 1 - PREDICTION
# =====================================================

with tab1:

    st.markdown("## Applicant Information")

    col1, col2, col3 = st.columns(3)

    with col1:
        age = st.number_input("Age", 18, 100, 30)
        income = st.number_input("Income", 0, 1000000, 50000)
        loan_amount = st.number_input("Loan Amount", 0, 1000000, 20000)

    with col2:
        credit_score = st.number_input(
            "Credit Score", 300, 850, 700
        )
        months_employed = st.number_input(
            "Months Employed", 0, 600, 48
        )
        num_credit_lines = st.number_input(
            "Number of Credit Lines", 0, 50, 4
        )

    with col3:
        interest_rate = st.number_input(
            "Interest Rate", 0.0, 100.0, 10.5
        )
        loan_term = st.number_input(
            "Loan Term", 1, 480, 36
        )
        dti_ratio = st.number_input(
            "DTI Ratio", 0.0, 10.0, 0.35
        )

    st.markdown("## Additional Information")

    col1, col2, col3 = st.columns(3)

    with col1:
        education = st.selectbox(
            "Education",
            ["Bachelor's", "High School", "Master's", "PhD"]
        )

        marital_status = st.selectbox(
            "Marital Status",
            ["Divorced", "Married", "Single"]
        )

    with col2:
        employment_type = st.selectbox(
            "Employment Type",
            ["Full-time", "Part-time", "Self-employed", "Unemployed"]
        )

        mortgage = st.selectbox(
            "Has Mortgage",
            ["No", "Yes"]
        )

    with col3:
        dependents = st.selectbox(
            "Has Dependents",
            ["No", "Yes"]
        )

        cosigner = st.selectbox(
            "Has Co-Signer",
            ["No", "Yes"]
        )

    loan_purpose = st.selectbox(
        "Loan Purpose",
        ["Personal", "Business", "Education", "Home", "Other"]
    )

    # ----------------------------
    # Predict
    # ----------------------------

    if st.button("Predict Risk"):

        data = {col: 0 for col in feature_columns}

        # Numerical
        data["Age"] = age
        data["Income"] = income
        data["LoanAmount"] = loan_amount
        data["CreditScore"] = credit_score
        data["MonthsEmployed"] = months_employed
        data["NumCreditLines"] = num_credit_lines
        data["InterestRate"] = interest_rate
        data["LoanTerm"] = loan_term
        data["DTIRatio"] = dti_ratio

        # Education
        if education == "High School":
            data["Education_High School"] = 1
        elif education == "Master's":
            data["Education_Master's"] = 1
        elif education == "PhD":
            data["Education_PhD"] = 1

        # Employment
        if employment_type == "Part-time":
            data["EmploymentType_Part-time"] = 1
        elif employment_type == "Self-employed":
            data["EmploymentType_Self-employed"] = 1
        elif employment_type == "Unemployed":
            data["EmploymentType_Unemployed"] = 1

        # Marital
        if marital_status == "Married":
            data["MaritalStatus_Married"] = 1
        elif marital_status == "Single":
            data["MaritalStatus_Single"] = 1

        # Mortgage
        if mortgage == "Yes":
            data["HasMortgage_Yes"] = 1

        # Dependents
        if dependents == "Yes":
            data["HasDependents_Yes"] = 1

        # Purpose
        if loan_purpose == "Business":
            data["LoanPurpose_Business"] = 1
        elif loan_purpose == "Education":
            data["LoanPurpose_Education"] = 1
        elif loan_purpose == "Home":
            data["LoanPurpose_Home"] = 1
        elif loan_purpose == "Other":
            data["LoanPurpose_Other"] = 1

        # Co-Signer
        if cosigner == "Yes":
            data["HasCoSigner_Yes"] = 1

        input_df = pd.DataFrame([data])

        prediction = model.predict(input_df)[0]
        probability = model.predict_proba(input_df)[0][1]

        st.markdown("---")

        col1, col2, col3 = st.columns(3)

        with col1:
            st.metric(
                "Default Probability",
                f"{probability*100:.2f}%"
            )

        with col2:
            st.metric(
                "Credit Score",
                credit_score
            )

        with col3:
            st.metric(
                "Income",
                f"${income:,.0f}"
            )

        st.progress(float(probability))

        if prediction == 1:
            st.error("🔴 HIGH RISK APPLICANT")
        else:
            st.success("🟢 LOW RISK APPLICANT")

# =====================================================
# TAB 2 - INSIGHTS
# =====================================================

with tab2:

    st.subheader("Exploratory Data Analysis")

    st.info(
        "Add your EDA charts here "
        "(Credit Score Distribution, Income Analysis, Loan Amount Analysis, Default Distribution)"
    )

# =====================================================
# TAB 3 - ABOUT
# =====================================================

with tab3:

    st.subheader("Model Information")

    st.markdown("""
### Loan Default Prediction Project

**Algorithm:** Logistic Regression

**Features:** 24

**Target Variable:** Default

**Train/Test Split:** 80/20

**Purpose:**
Predict whether an applicant is likely to default on a loan based on financial and demographic factors.

**Developed Using:**
- Python
- Pandas
- Scikit-Learn
- Streamlit
    """)