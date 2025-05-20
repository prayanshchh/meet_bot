set -e

CLUSTER_NAME="meet"

echo "🌀 Deleting existing kind cluster (if any)..."
kind delete cluster --name "$CLUSTER_NAME" || true

echo "🌀 Creating kind cluster '$CLUSTER_NAME'..."
kind create cluster --name "$CLUSTER_NAME" --config k8s/kind-cluster.yaml

kubectl apply -f k8s/00-namespace.yaml

echo "📈 Installing KEDA in 'selenium' namespace..."

helm install keda-sel kedacore/keda \
  -n selenium \

echo "📦 Loading local Docker images (optional step)..."
docker build -t meetbot/backend:dev1 ./src/app -f ./src/app/Dockerfile
kind load docker-image meetbot/backend:dev1 --name $CLUSTER_NAME

echo "📦 Adding Helm repos..."
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

echo "🐘 Installing PostgreSQL..."
helm install pg bitnami/postgresql -n app -f k8s/40-postgres-values.yaml
  
# echo "🧠 Installing Redis..."
# helm install redis bitnami/redis -n app -f k8s/41-redis-values.yaml

echo "📦 Installing MinIO..."
helm install minio bitnami/minio -n app -f k8s/42-minio-values.yaml

echo "📜 Applying remaining Kubernetes manifests..."
kubectl apply -f k8s/10-secrets.yaml
kubectl apply -f k8s/20-backend.yaml
kubectl apply -f k8s/21-backend-svc.yaml
kubectl apply -f k8s/22-ingress.yaml
kubectl apply -f k8s/selenium-hub-deployment.yaml
kubectl apply -f k8s/selenium-hub-svc.yaml
kubectl apply -f k8s/selenium-node-chrome-deployment.yaml
kubectl apply -f k8s/selenium-chrome-scaledobject.yaml

echo "✅ Cluster '$CLUSTER_NAME' is ready with PostgreSQL, Redis, MinIO, Selenium, Backend, Worker, and KEDA."
