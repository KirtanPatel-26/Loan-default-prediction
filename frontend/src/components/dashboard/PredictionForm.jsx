import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User, DollarSign, CreditCard, Briefcase, Clock,
  TrendingUp, Percent, Calendar, GraduationCap, Heart,
  Home, Users, FileText, Shield, Zap, RotateCcw
} from 'lucide-react';
import SliderInput from '../ui/SliderInput';
import SelectInput from '../ui/SelectInput';
import ProButton from '../ui/ProButton';
import Card3D from '../3d/Card3D';
import { getPresets } from '../../services/api';

const defaultState = {
  age: 30,
  income: 50000,
  loan_amount: 20000,
  credit_score: 700,
  months_employed: 48,
  num_credit_lines: 4,
  interest_rate: 10.5,
  loan_term: 36,
  dti_ratio: 0.35,
  education: "Bachelor's",
  employment_type: 'Full-time',
  marital_status: 'Single',
  has_mortgage: false,
  has_dependents: false,
  loan_purpose: 'Personal',
  has_cosigner: false
};

const booleanOptions = [
  { value: 'false', label: 'No' },
  { value: 'true', label: 'Yes' }
];

const educationOptions = [
  { value: "Bachelor's", label: "Bachelor's" },
  { value: 'High School', label: 'High School' },
  { value: "Master's", label: "Master's" },
  { value: 'PhD', label: 'PhD' }
];

const employmentOptions = [
  { value: 'Full-time', label: 'Full-time' },
  { value: 'Part-time', label: 'Part-time' },
  { value: 'Self-employed', label: 'Self-employed' },
  { value: 'Unemployed', label: 'Unemployed' }
];

const maritalOptions = [
  { value: 'Divorced', label: 'Divorced' },
  { value: 'Married', label: 'Married' },
  { value: 'Single', label: 'Single' }
];

const purposeOptions = [
  { value: 'Personal', label: 'Personal' },
  { value: 'Business', label: 'Business' },
  { value: 'Education', label: 'Education' },
  { value: 'Home', label: 'Home' },
  { value: 'Other', label: 'Other' }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24 }
  }
};

const PredictionForm = ({ onPredict, loading }) => {
  const [formData, setFormData] = useState(defaultState);
  const [presets, setPresets] = useState([]);

  useEffect(() => {
    const fetchPresets = async () => {
      try {
        const data = await getPresets();
        if (data && Array.isArray(data)) {
          setPresets(data);
        }
      } catch (error) {
        console.error("Failed to fetch presets:", error);
      }
    };
    fetchPresets();
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBooleanChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value === 'true'
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onPredict(formData);
  };

  const handleReset = () => {
    setFormData(defaultState);
  };

  const handleApplyPreset = (presetValues) => {
    setFormData(prev => ({ ...prev, ...presetValues }));
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Preset Bar */}
      {presets.length > 0 && (
        <motion.div variants={itemVariants} className="flex flex-wrap gap-3 mb-6">
          <span className="text-sm text-gray-400 flex items-center mr-2">
            <Zap className="w-4 h-4 mr-1 text-primary-400" /> Quick Fill:
          </span>
          {presets.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(preset.values)}
              className="px-3 py-1 text-xs font-medium bg-white/5 border border-white/10 rounded-full text-gray-300 hover:bg-white/10 hover:text-white transition-all backdrop-blur-sm flex items-center"
            >
              {preset.name}
            </button>
          ))}
        </motion.div>
      )}

      {/* Financial Profile */}
      <motion.div variants={itemVariants}>
        <Card3D className="p-6 border border-white/5 bg-black/20 backdrop-blur-md rounded-2xl">
          <div className="flex items-center gap-2 mb-6 text-xl font-semibold text-white">
            <DollarSign className="w-6 h-6 text-primary-400" />
            <h2>Financial Profile</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SliderInput
              label="Annual Income"
              value={formData.income}
              onChange={(val) => handleChange('income', val)}
              min={0} max={500000} step={1000} suffix="$"
              icon={<Briefcase className="w-4 h-4" />}
            />
            <SliderInput
              label="Loan Amount"
              value={formData.loan_amount}
              onChange={(val) => handleChange('loan_amount', val)}
              min={0} max={500000} step={1000} suffix="$"
              icon={<DollarSign className="w-4 h-4" />}
            />
            <SliderInput
              label="Interest Rate"
              value={formData.interest_rate}
              onChange={(val) => handleChange('interest_rate', val)}
              min={0} max={30} step={0.1} suffix="%"
              icon={<Percent className="w-4 h-4" />}
            />
            <SliderInput
              label="Loan Term"
              value={formData.loan_term}
              onChange={(val) => handleChange('loan_term', val)}
              min={1} max={480} step={1} suffix=" mo"
              icon={<Calendar className="w-4 h-4" />}
            />
          </div>
        </Card3D>
      </motion.div>

      {/* Credit & Employment */}
      <motion.div variants={itemVariants}>
        <Card3D className="p-6 border border-white/5 bg-black/20 backdrop-blur-md rounded-2xl">
          <div className="flex items-center gap-2 mb-6 text-xl font-semibold text-white">
            <CreditCard className="w-6 h-6 text-secondary-400" />
            <h2>Credit & Employment</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SliderInput
              label="Age"
              value={formData.age}
              onChange={(val) => handleChange('age', val)}
              min={18} max={100} step={1}
              icon={<User className="w-4 h-4" />}
            />
            <SliderInput
              label="Credit Score"
              value={formData.credit_score}
              onChange={(val) => handleChange('credit_score', val)}
              min={300} max={850} step={1}
              icon={<TrendingUp className="w-4 h-4" />}
            />
            <SliderInput
              label="Months Employed"
              value={formData.months_employed}
              onChange={(val) => handleChange('months_employed', val)}
              min={0} max={600} step={1} suffix=" mo"
              icon={<Clock className="w-4 h-4" />}
            />
            <SliderInput
              label="Credit Lines"
              value={formData.num_credit_lines}
              onChange={(val) => handleChange('num_credit_lines', val)}
              min={0} max={50} step={1}
              icon={<FileText className="w-4 h-4" />}
            />
            <SliderInput
              label="DTI Ratio"
              value={formData.dti_ratio}
              onChange={(val) => handleChange('dti_ratio', val)}
              min={0} max={5} step={0.01}
              icon={<Percent className="w-4 h-4" />}
            />
          </div>
        </Card3D>
      </motion.div>

      {/* Demographics & Details */}
      <motion.div variants={itemVariants}>
        <Card3D className="p-6 border border-white/5 bg-black/20 backdrop-blur-md rounded-2xl">
          <div className="flex items-center gap-2 mb-6 text-xl font-semibold text-white">
            <Users className="w-6 h-6 text-tertiary-400" />
            <h2>Demographics & Details</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <SelectInput
              label="Education"
              value={formData.education}
              onChange={(val) => handleChange('education', val)}
              options={educationOptions}
              icon={<GraduationCap className="w-4 h-4" />}
            />
            <SelectInput
              label="Employment Type"
              value={formData.employment_type}
              onChange={(val) => handleChange('employment_type', val)}
              options={employmentOptions}
              icon={<Briefcase className="w-4 h-4" />}
            />
            <SelectInput
              label="Marital Status"
              value={formData.marital_status}
              onChange={(val) => handleChange('marital_status', val)}
              options={maritalOptions}
              icon={<Heart className="w-4 h-4" />}
            />
            <SelectInput
              label="Loan Purpose"
              value={formData.loan_purpose}
              onChange={(val) => handleChange('loan_purpose', val)}
              options={purposeOptions}
              icon={<FileText className="w-4 h-4" />}
            />
            <SelectInput
              label="Has Mortgage"
              value={formData.has_mortgage.toString()}
              onChange={(val) => handleBooleanChange('has_mortgage', val)}
              options={booleanOptions}
              icon={<Home className="w-4 h-4" />}
            />
            <SelectInput
              label="Has Dependents"
              value={formData.has_dependents.toString()}
              onChange={(val) => handleBooleanChange('has_dependents', val)}
              options={booleanOptions}
              icon={<Users className="w-4 h-4" />}
            />
            <SelectInput
              label="Has Cosigner"
              value={formData.has_cosigner.toString()}
              onChange={(val) => handleBooleanChange('has_cosigner', val)}
              options={booleanOptions}
              icon={<User className="w-4 h-4" />}
            />
          </div>
        </Card3D>
      </motion.div>

      {/* Action Bar */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 pt-4">
        <ProButton 
          type="submit" 
          variant="primary" 
          fullWidth={true} 
          loading={loading}
          icon={<Shield className="w-5 h-5" />}
        >
          Analyze Risk
        </ProButton>
        <ProButton 
          type="button" 
          variant="secondary" 
          onClick={handleReset}
          icon={<RotateCcw className="w-5 h-5" />}
          disabled={loading}
        >
          Reset
        </ProButton>
      </motion.div>
    </motion.form>
  );
};

export default PredictionForm;
