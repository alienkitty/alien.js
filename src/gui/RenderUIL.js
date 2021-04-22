import { RenderManager } from '../controllers/world/RenderManager.js';
import { UIL } from '../utils/gui/UIL.js';

export class RenderUIL {
    static init() {
        const { luminosityMaterial, bloomCompositeMaterial } = RenderManager;

        const ui = new UIL('Bloom', luminosityMaterial);

        ui.addSlide(RenderManager, 'bloomStrength', () => {
            bloomCompositeMaterial.uniforms.uBloomFactors.value = RenderManager.bloomFactors();
        });
        ui.addSlide(RenderManager, 'bloomRadius', () => {
            bloomCompositeMaterial.uniforms.uBloomFactors.value = RenderManager.bloomFactors();
        });

        ui.open();
    }
}
