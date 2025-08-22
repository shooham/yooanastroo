#!/usr/bin/env node

/**
 * Deployment script for Yooanastro to Vercel
 * This script helps set up environment variables and deploy
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Yooanastro Vercel Deployment Script');
console.log('=====================================\n');

// Environment variables that need to be set in Vercel
const requiredEnvVars = {
  'NODE_ENV': 'production',
  'SUPABASE_URL': 'https://eynsmbktdbrhixczuvty.supabase.co',
  'SUPABASE_ANON_KEY': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5bnNtYmt0ZGJyaGl4Y3p1dnR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNTA1NzQsImV4cCI6MjA3MDcyNjU3NH0.0CW5FrtCIEVSA6i54FXEvT6xayLLrC9X0ceB7i1_J3k',
  'VITE_SUPABASE_ANON_KEY': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5bnNtYmt0ZGJyaGl4Y3p1dnR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNTA1NzQsImV4cCI6MjA3MDcyNjU3NH0.0CW5FrtCIEVSA6i54FXEvT6xayLLrC9X0ceB7i1_J3k',
  'RAZORPAY_KEY_ID': 'rzp_test_NjWnGjHPeR8zzv'
};

const secretEnvVars = {
  'SUPABASE_SERVICE_ROLE_KEY': 'Get from: https://supabase.com/dashboard/project/eynsmbktdbrhixczuvty/settings/api',
  'RAZORPAY_KEY_SECRET': 'Get from: https://dashboard.razorpay.com/app/keys'
};

function checkVercelCLI() {
  try {
    execSync('vercel --version', { stdio: 'pipe' });
    console.log('✅ Vercel CLI is installed');
    return true;
  } catch (error) {
    console.log('❌ Vercel CLI not found. Installing...');
    try {
      execSync('npm install -g vercel', { stdio: 'inherit' });
      console.log('✅ Vercel CLI installed successfully');
      return true;
    } catch (installError) {
      console.error('❌ Failed to install Vercel CLI');
      console.log('Please install manually: npm install -g vercel');
      return false;
    }
  }
}

function setEnvironmentVariables() {
  console.log('\n📝 Setting up environment variables...');
  
  // Set the non-secret environment variables
  for (const [key, value] of Object.entries(requiredEnvVars)) {
    try {
      execSync(`vercel env add ${key} production`, {
        input: value,
        stdio: ['pipe', 'pipe', 'inherit']
      });
      console.log(`✅ Set ${key}`);
    } catch (error) {
      console.log(`⚠️  ${key} might already exist or failed to set`);
    }
  }
  
  console.log('\n🔐 Secret environment variables needed:');
  console.log('You need to manually add these in Vercel Dashboard:');
  for (const [key, instruction] of Object.entries(secretEnvVars)) {
    console.log(`- ${key}: ${instruction}`);
  }
}

function deployProject() {
  console.log('\n🚀 Deploying to Vercel...');
  try {
    execSync('vercel --prod', { stdio: 'inherit' });
    console.log('\n✅ Deployment completed!');
  } catch (error) {
    console.error('❌ Deployment failed');
    process.exit(1);
  }
}

function main() {
  // Check if we're in the right directory
  if (!fs.existsSync('package.json')) {
    console.error('❌ package.json not found. Please run this script from the project root.');
    process.exit(1);
  }
  
  // Check Vercel CLI
  if (!checkVercelCLI()) {
    process.exit(1);
  }
  
  // Login to Vercel if needed
  try {
    execSync('vercel whoami', { stdio: 'pipe' });
    console.log('✅ Already logged in to Vercel');
  } catch (error) {
    console.log('🔐 Please login to Vercel...');
    execSync('vercel login', { stdio: 'inherit' });
  }
  
  // Set environment variables
  setEnvironmentVariables();
  
  console.log('\n⚠️  IMPORTANT: Before deploying, please:');
  console.log('1. Go to https://supabase.com/dashboard/project/eynsmbktdbrhixczuvty/settings/api');
  console.log('2. Copy the "service_role" key');
  console.log('3. Go to your Vercel dashboard → Project → Settings → Environment Variables');
  console.log('4. Add SUPABASE_SERVICE_ROLE_KEY with the copied value');
  console.log('5. Go to https://dashboard.razorpay.com/app/keys');
  console.log('6. Copy your Key Secret');
  console.log('7. Add RAZORPAY_KEY_SECRET to Vercel with the copied value');
  console.log('\nPress Enter when done, or Ctrl+C to exit...');
  
  // Wait for user input
  process.stdin.once('data', () => {
    deployProject();
  });
}

if (require.main === module) {
  main();
}