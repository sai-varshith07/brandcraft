import { useState, useRef, useEffect } from "react";
import { toast } from "./UI";

// Add CSS animation for spinner
const styles = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

// Inject styles if not already present
if (typeof document !== 'undefined') {
    if (!document.getElementById('brandcraft-deploy-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'brandcraft-deploy-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
}

// ─── Deployment Status Component ──────────────────────────────────────────────
function DeploymentStatus({ status, message, url, githubUrl, deploymentId, onRetry }) {
    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return '⏳';
            case 'success': return '✅';
            case 'error': return '❌';
            default: return '⏳';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'var(--violet)';
            case 'success': return 'var(--green)';
            case 'error': return 'var(--red)';
            default: return 'var(--violet)';
        }
    };

    return (
        <div style={{
            padding: '16px 20px',
            borderRadius: '12px',
            border: '1px solid var(--border)',
            background: 'var(--bg2)',
            marginBottom: '20px'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <span style={{ fontSize: '18px' }}>{getStatusIcon(status)}</span>
                <span style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    color: getStatusColor(status),
                    textTransform: 'capitalize'
                }}>
                    {status === 'pending' ? 'Deploying...' : status}
                </span>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: '1.5' }}>
                {message}
            </div>

            {status === 'success' && (
                <div style={{ marginTop: '12px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            padding: '8px 16px',
                            borderRadius: '8px',
                            background: 'var(--green-soft)',
                            color: 'var(--green)',
                            textDecoration: 'none',
                            fontWeight: '700',
                            fontSize: '12px',
                            border: '1px solid rgba(76, 175, 80, 0.3)',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
                        onMouseLeave={(e) => e.target.style.transform = 'translateY(0px)'}
                    >
                        🌐 Visit Website
                    </a>
                    <button
                        onClick={onRetry}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '8px',
                            background: 'var(--violet-soft)',
                            color: 'var(--violet)',
                            border: '1px solid rgba(124, 77, 255, 0.3)',
                            fontWeight: '700',
                            fontSize: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
                        onMouseLeave={(e) => e.target.style.transform = 'translateY(0px)'}
                    >
                        🔄 Redeploy
                    </button>
                </div>
            )}

            {status === 'error' && (
                <div style={{ marginTop: '12px', display: 'flex', gap: '10px' }}>
                    <button
                        onClick={onRetry}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '8px',
                            background: 'var(--red-soft)',
                            color: 'var(--red)',
                            border: '1px solid rgba(244, 67, 54, 0.3)',
                            fontWeight: '700',
                            fontSize: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
                        onMouseLeave={(e) => e.target.style.transform = 'translateY(0px)'}
                    >
                        🔄 Try Again
                    </button>
                </div>
            )}
        </div>
    );
}

// ─── Deployment Logs Component ───────────────────────────────────────────────
function DeploymentLogs({ logs, isVisible }) {
    if (!isVisible || !logs.length) return null;

    return (
        <div style={{
            marginTop: '16px',
            padding: '12px',
            borderRadius: '8px',
            background: 'var(--bg3)',
            border: '1px solid var(--border)',
            maxHeight: '200px',
            overflow: 'auto'
        }}>
            <div style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '8px', fontWeight: '700' }}>
                Deployment Logs:
            </div>
            {logs.map((log, index) => (
                <div key={index} style={{ fontSize: '11px', color: 'var(--text2)', marginBottom: '4px', fontFamily: 'monospace' }}>
                    {log}
                </div>
            ))}
        </div>
    );
}

// ─── One-Click Deploy Component ───────────────────────────────────────────────
export function OneClickDeploy({ brandProfile, selectedOutputs, onDeployComplete }) {
    const [isDeploying, setIsDeploying] = useState(false);
    const [deploymentStatus, setDeploymentStatus] = useState('idle'); // idle, pending, success, error
    const [deploymentUrl, setDeploymentUrl] = useState('');
    const [githubUrl, setGithubUrl] = useState('');
    const [deploymentId, setDeploymentId] = useState('');
    const [deploymentMessage, setDeploymentMessage] = useState('');
    const [showLogs, setShowLogs] = useState(false);
    const [logs, setLogs] = useState([]);
    const abortControllerRef = useRef(null);

    // Add log entry
    const addLog = (message) => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
    };

    // Generate HTML content for deployment
    const generateHTMLContent = () => {
        const bp = brandProfile || {};
        const outputs = selectedOutputs || {};

        // Build CSS styles
        const styles = `
      :root {
        --primary: ${bp.primaryColor || '#7C4DFF'};
        --secondary: ${bp.secondaryColor || '#F050A8'};
        --accent: ${bp.accentColor || '#00C9B4'};
        --bg: #ffffff;
        --text: #1a1a1a;
        --text2: #666666;
      }
      
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: var(--bg); color: var(--text); line-height: 1.6; }
      .container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
      header { text-align: center; margin-bottom: 60px; }
      .brand-name { font-size: 48px; font-weight: 800; background: linear-gradient(135deg, var(--primary), var(--secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 10px; }
      .brand-tagline { font-size: 18px; color: var(--text2); margin-bottom: 30px; }
      .hero { background: linear-gradient(135deg, rgba(124, 77, 255, 0.1), rgba(240, 80, 168, 0.1)); padding: 60px; border-radius: 20px; text-align: center; margin-bottom: 40px; }
      .btn-primary { background: linear-gradient(135deg, var(--primary), var(--secondary)); color: white; padding: 15px 30px; border: none; border-radius: 50px; font-size: 16px; font-weight: 700; cursor: pointer; transition: transform 0.2s; }
      .btn-primary:hover { transform: translateY(-2px); }
      .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; margin-top: 40px; }
      .feature-card { background: white; padding: 30px; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border: 1px solid rgba(0,0,0,0.05); }
      .feature-title { font-size: 20px; font-weight: 700; margin-bottom: 10px; color: var(--primary); }
      .footer { text-align: center; margin-top: 60px; padding-top: 40px; border-top: 1px solid rgba(0,0,0,0.1); color: var(--text2); }
    `;

        // Build HTML content
        const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${bp.brandName || 'BrandCraft'} - ${bp.businessDo || 'Your Brand'}</title>
    <style>${styles}</style>
</head>
<body>
    <div class="container">
        <header>
            <h1 class="brand-name">${bp.brandName || 'BrandCraft'}</h1>
            <p class="brand-tagline">${bp.businessDo || 'Building remarkable brands'}</p>
        </header>

        <section class="hero">
            <h2 style="font-size: 32px; margin-bottom: 20px;">Welcome to ${bp.brandName || 'Your Brand'}</h2>
            <p style="font-size: 16px; margin-bottom: 30px; max-width: 600px; margin-left: auto; margin-right: auto;">
                ${bp.businessDo || 'We create exceptional experiences that inspire and delight.'}
            </p>
            <button class="btn-primary" onclick="document.getElementById('contact').scrollIntoView({behavior: 'smooth'})">
                Get Started
            </button>
        </section>

        <section class="features">
            <div class="feature-card">
                <h3 class="feature-title">Our Mission</h3>
                <p>${bp.businessDo || 'We are dedicated to excellence in everything we do.'}</p>
            </div>
            <div class="feature-card">
                <h3 class="feature-title">Our Values</h3>
                <p>${bp.brandVoice || 'Innovation, quality, and customer satisfaction.'}</p>
            </div>
            <div class="feature-card">
                <h3 class="feature-title">Our Aesthetic</h3>
                <p>${bp.designAesthetic || 'Clean, modern, and impactful design.'}</p>
            </div>
        </section>

        <section id="contact" style="margin-top: 60px; text-align: center;">
            <h2 style="font-size: 28px; margin-bottom: 20px;">Let's Work Together</h2>
            <p style="font-size: 16px; color: var(--text2); margin-bottom: 30px;">
                Ready to elevate your brand? Contact us today.
            </p>
            <button class="btn-primary">Contact Us</button>
        </section>

        <footer class="footer">
            <p>&copy; ${new Date().getFullYear()} ${bp.brandName || 'BrandCraft'}. Built with ❤️ and BrandCraft.</p>
        </footer>
    </div>
</body>
</html>`;

        return html;
    };

    // Deploy function
    const deployWebsite = async () => {
        if (isDeploying) return;

        setIsDeploying(true);
        setDeploymentStatus('pending');
        setDeploymentUrl('');
        setGithubUrl('');
        setDeploymentId('');
        setDeploymentMessage('Starting deployment process...');
        setLogs([]);
        setShowLogs(true);
        addLog('Initializing deployment...');

        try {
            const htmlContent = generateHTMLContent();
            addLog('Generated HTML content');

            // Create abort controller for this deployment
            abortControllerRef.current = new AbortController();

            const response = await fetch('/api/deploy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    html: htmlContent,
                    brandName: brandProfile?.brandName || 'BrandCraft'
                }),
                signal: abortControllerRef.current.signal
            });

            addLog('Sending deployment request to server...');

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            addLog('Deployment successful!');

            setDeploymentStatus('success');
            setDeploymentUrl(result.url);
            setGithubUrl(result.githubUrl);
            setDeploymentId(result.deploymentId);
            setDeploymentMessage('Your website has been successfully deployed!');

            toast('success', 'Website deployed successfully!');
            onDeployComplete?.(result);

        } catch (error) {
            if (error.name === 'AbortError') {
                addLog('Deployment cancelled');
                setDeploymentMessage('Deployment was cancelled');
            } else {
                addLog(`Error: ${error.message}`);
                setDeploymentStatus('error');
                setDeploymentMessage(`Deployment failed: ${error.message}`);
                toast('error', `Deployment failed: ${error.message}`);
            }
        } finally {
            setIsDeploying(false);
        }
    };

    // Cancel deployment
    const cancelDeployment = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            addLog('Cancelling deployment...');
            setDeploymentMessage('Cancelling deployment...');
        }
    };

    // Retry deployment
    const retryDeployment = () => {
        setDeploymentStatus('idle');
        setDeploymentUrl('');
        setGithubUrl('');
        setDeploymentId('');
        setDeploymentMessage('');
        setLogs([]);
        deployWebsite();
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text)', marginBottom: '8px' }}>
                    🚀 One-Click Website Deployment
                </h2>
                <p style={{ color: 'var(--text2)', fontSize: '14px', lineHeight: '1.6' }}>
                    Deploy your generated website to Vercel with a single click. Your site will be live and accessible worldwide in seconds.
                </p>
            </div>

            {/* Deployment Status */}
            {deploymentStatus !== 'idle' && (
                <DeploymentStatus
                    status={deploymentStatus}
                    message={deploymentMessage}
                    url={deploymentUrl}
                    githubUrl={githubUrl}
                    deploymentId={deploymentId}
                    onRetry={retryDeployment}
                />
            )}

            {/* Deployment Logs */}
            <DeploymentLogs logs={logs} isVisible={showLogs} />

            {/* Action Buttons */}
            <div style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                justifyContent: deploymentStatus === 'pending' ? 'space-between' : 'flex-start'
            }}>
                {deploymentStatus === 'idle' && (
                    <>
                        <button
                            onClick={deployWebsite}
                            disabled={isDeploying}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '14px 24px',
                                borderRadius: '16px',
                                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                                color: 'white',
                                border: 'none',
                                fontSize: '16px',
                                fontWeight: '700',
                                cursor: isDeploying ? 'not-allowed' : 'pointer',
                                opacity: isDeploying ? 0.7 : 1,
                                transition: 'all 0.3s',
                                boxShadow: '0 8px 25px rgba(124, 77, 255, 0.3)',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                            onMouseEnter={(e) => {
                                if (!isDeploying) {
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 12px 35px rgba(124, 77, 255, 0.4)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isDeploying) {
                                    e.target.style.transform = 'translateY(0px)';
                                    e.target.style.boxShadow = '0 8px 25px rgba(124, 77, 255, 0.3)';
                                }
                            }}
                        >
                            <span style={{ fontSize: '18px' }}>🚀</span>
                            Launch Website
                            {isDeploying && (
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backdropFilter: 'blur(2px)'
                                }}>
                                    <div style={{
                                        width: '20px',
                                        height: '20px',
                                        border: '2px solid rgba(255,255,255,0.3)',
                                        borderTop: '2px solid white',
                                        borderRadius: '50%',
                                        animation: 'spin 1s linear infinite'
                                    }}></div>
                                </div>
                            )}
                        </button>

                        <button
                            onClick={() => setShowLogs(!showLogs)}
                            style={{
                                padding: '12px 18px',
                                borderRadius: '12px',
                                border: '1px solid var(--border)',
                                background: 'transparent',
                                color: 'var(--text2)',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = 'var(--bg2)';
                                e.target.style.borderColor = 'var(--border2)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'transparent';
                                e.target.style.borderColor = 'var(--border)';
                            }}
                        >
                            {showLogs ? 'Hide' : 'Show'} Logs
                        </button>
                    </>
                )}

                {deploymentStatus === 'pending' && (
                    <>
                        <button
                            onClick={cancelDeployment}
                            style={{
                                padding: '12px 18px',
                                borderRadius: '12px',
                                border: '1px solid var(--red)',
                                background: 'transparent',
                                color: 'var(--red)',
                                fontSize: '14px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = 'var(--red-soft)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'transparent';
                            }}
                        >
                            ❌ Cancel
                        </button>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '12px',
                            color: 'var(--text3)',
                            marginLeft: 'auto'
                        }}>
                            <div style={{
                                width: '12px',
                                height: '12px',
                                border: '2px solid rgba(124,77,255,0.3)',
                                borderTop: '2px solid var(--primary)',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                            }}></div>
                            Deploying...
                        </div>
                    </>
                )}

                {deploymentStatus === 'success' && (
                    <button
                        onClick={retryDeployment}
                        style={{
                            padding: '12px 18px',
                            borderRadius: '12px',
                            border: '1px solid var(--border)',
                            background: 'var(--bg2)',
                            color: 'var(--text2)',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = 'var(--bg3)';
                            e.target.style.borderColor = 'var(--border2)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'var(--bg2)';
                            e.target.style.borderColor = 'var(--border)';
                        }}
                    >
                        🔄 Redeploy
                    </button>
                )}

                {deploymentStatus === 'error' && (
                    <button
                        onClick={retryDeployment}
                        style={{
                            padding: '12px 18px',
                            borderRadius: '12px',
                            border: '1px solid var(--red)',
                            background: 'var(--red-soft)',
                            color: 'var(--red)',
                            fontSize: '14px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = 'var(--red)';
                            e.target.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'var(--red-soft)';
                            e.target.style.color = 'var(--red)';
                        }}
                    >
                        🔄 Try Again
                    </button>
                )}
            </div>

            {/* Instructions */}
            {deploymentStatus === 'idle' && (
                <div style={{
                    marginTop: '24px',
                    padding: '16px',
                    borderRadius: '12px',
                    background: 'var(--bg2)',
                    border: '1px solid var(--border)',
                    fontSize: '12px',
                    color: 'var(--text3)'
                }}>
                    <div style={{ fontWeight: '700', marginBottom: '8px' }}>How it works:</div>
                    <ol style={{ margin: 0, paddingLeft: '18px', lineHeight: '1.6' }}>
                        <li>Click "Launch Website" to start the deployment process</li>
                        <li>We'll create a GitHub repository for your project</li>
                        <li>Your website files will be uploaded to GitHub</li>
                        <li>Vercel will automatically deploy your site</li>
                        <li>You'll receive a live URL to share with the world!</li>
                    </ol>
                </div>
            )}
        </div>
    );
}